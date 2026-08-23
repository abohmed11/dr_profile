/**
 * Firebase Firestore integration for Shefaa Medical SaaS Platform
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  disableNetwork,
  setLogLevel
} from 'firebase/firestore';

setLogLevel('silent');
import firebaseConfig from '../../firebase-applet-config.json';
import { Doctor, Appointment, LandingPageConfig, DoctorBanner, SystemSpecialty } from '../types';
import { compressObjectImages } from './imageUtils';
import { 
  saveDoctorToSupabase, 
  deleteDoctorFromSupabase, 
  saveAppointmentToSupabase, 
  deleteAppointmentFromSupabase, 
  saveLandingConfigToSupabase, 
  saveBannersToSupabase,
  deleteBannerFromSupabase
} from './supabase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Safely initialize Firebase App
let app: any = null;
let firestoreDb: any = null;
let firebaseAuth: any = null;

try {
  if (firebaseConfig && (firebaseConfig.apiKey || firebaseConfig.projectId)) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const targetDbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? firebaseConfig.firestoreDatabaseId
      : undefined;

    const firestoreSettings: any = {
      ignoreUndefinedProperties: true,
      experimentalAutoDetectLongPolling: true,
    };

    try {
      firestoreDb = targetDbId 
        ? initializeFirestore(app, firestoreSettings, targetDbId) 
        : initializeFirestore(app, firestoreSettings);
    } catch {
      try {
        firestoreDb = targetDbId ? getFirestore(app, targetDbId) : getFirestore(app);
      } catch {
        firestoreDb = null;
      }
    }
    
    firebaseAuth = getAuth(app);
  }
} catch (e) {
  console.warn("Firebase initialization warning (will fallback gracefully):", e);
}

export const db = firestoreDb;
export const auth = firebaseAuth;

// Check session & persistent quota status for today
const getTodayDateString = () => new Date().toISOString().split('T')[0];

const checkInitialQuotaStatus = (): boolean => {
  try {
    const storedDate = localStorage.getItem('firestore_quota_date');
    const isExceeded = localStorage.getItem('firestore_quota_exceeded') === 'true' || 
                       sessionStorage.getItem('firestore_quota_exceeded') === 'true';
    if (isExceeded && storedDate === getTodayDateString()) {
      return true;
    }
    // If it's a new day, clear previous day's quota flag
    if (storedDate && storedDate !== getTodayDateString()) {
      localStorage.removeItem('firestore_quota_exceeded');
      localStorage.removeItem('firestore_quota_date');
      sessionStorage.removeItem('firestore_quota_exceeded');
      return false;
    }
    return isExceeded;
  } catch {
    return false;
  }
};

export let isFirestoreQuotaExceeded = checkInitialQuotaStatus();

if (isFirestoreQuotaExceeded && db) {
  disableNetwork(db).catch(() => {});
}

export function setFirestoreQuotaExceeded(exceeded: boolean) {
  isFirestoreQuotaExceeded = exceeded;
  
  if (exceeded && db) {
    disableNetwork(db).catch(() => {});
  }
  
  try {
    const today = getTodayDateString();
    if (exceeded) {
      localStorage.setItem('firestore_quota_exceeded', 'true');
      localStorage.setItem('firestore_quota_date', today);
      sessionStorage.setItem('firestore_quota_exceeded', 'true');
      window.dispatchEvent(new CustomEvent('firestore_quota_status', { detail: { exceeded: true } }));
    } else {
      localStorage.removeItem('firestore_quota_exceeded');
      localStorage.removeItem('firestore_quota_date');
      sessionStorage.removeItem('firestore_quota_exceeded');
      window.dispatchEvent(new CustomEvent('firestore_quota_status', { detail: { exceeded: false } }));
    }
  } catch {}
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  const isQuota = 
    errMsg.includes('resource-exhausted') || 
    errMsg.includes('Quota exceeded') || 
    errMsg.includes('quota') ||
    errMsg.includes('Write stream exhausted') ||
    errMsg.includes('Quota limit exceeded') ||
    errMsg.includes('Free daily write units') ||
    errMsg.includes('Free daily read units');

  if (isQuota) {
    setFirestoreQuotaExceeded(true);
    console.warn(`[Firestore Status: Daily Quota Limit Reached] Operation: ${operationType} on ${path || 'database'}. The app is operating seamlessly with local cache and cloud Supabase sync. Daily quota resets automatically next day.`);
    return;
  }

  const isNetworkOrOffline = 
    errMsg.includes('unavailable') || 
    errMsg.includes('code=unavailable') || 
    errMsg.includes('Could not reach Cloud Firestore') || 
    errMsg.includes("Backend didn't respond") || 
    errMsg.includes('The operation could not be completed') || 
    errMsg.includes('failed-precondition') || 
    errMsg.includes('offline') || 
    errMsg.includes('network-request-failed') || 
    errMsg.includes('deadline-exceeded') || 
    errMsg.includes('unreachable');

  if (isNetworkOrOffline) {
    console.warn(`[Firestore Status: Offline/Cached] Operation: ${operationType} on ${path || 'database'}. Operating with offline cache and Supabase sync.`);
    return;
  }

  const currentUser = auth?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo: currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Details:', JSON.stringify(errInfo));
}

/**
 * Helper to wrap Firestore promises with a timeout (e.g. 4 seconds) to avoid hanging
 * when backend is unreachable.
 */
export async function withFirestoreTimeout<T>(promise: Promise<T>, timeoutMs = 4000): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error("Could not reach Cloud Firestore backend within timeout"));
    }, timeoutMs);
  });

  try {
    const res = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

// Collection References
const DOCTORS_COL = 'doctors';
const APPOINTMENTS_COL = 'appointments';
const LANDING_CONFIG_COL = 'landingConfig';
const BANNERS_COL = 'banners';
const SPECIALTIES_COL = 'specialties';
const CONTACT_MESSAGES_COL = 'contactMessages';

// --- DOCTORS ---
export function subscribeDoctors(onData: (doctors: Doctor[]) => void): () => void {
  if (!db || isFirestoreQuotaExceeded) return () => {};
  const colRef = collection(db, DOCTORS_COL);
  try {
    return onSnapshot(
      colRef,
      (snapshot) => {
        const docs: Doctor[] = [];
        snapshot.forEach((docSnap) => {
          docs.push({ id: docSnap.id, ...docSnap.data() } as Doctor);
        });
        onData(docs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, DOCTORS_COL);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, DOCTORS_COL);
    return () => {};
  }
}

export async function saveDoctorInDb(doctor: Doctor): Promise<void> {
  // Always sync with Supabase Cloud Database regardless of Firestore quota
  saveDoctorToSupabase(doctor).catch((err) => {
    console.warn('Auto Supabase sync doctor warning:', err);
  });

  if (isFirestoreQuotaExceeded || !db) return;
  try {
    const docRef = doc(db, DOCTORS_COL, doctor.id);
    // Compress images to high quality (1200x1200, 0.9) to preserve high resolution while fitting Firestore 1MB limit
    const cleanDoc = await compressObjectImages(doctor, 1200, 1200, 0.9);
    
    try {
      await setDoc(docRef, cleanDoc, { merge: true });
    } catch (docErr: any) {
      if (String(docErr?.message || docErr).includes('Quota exceeded') || String(docErr?.message || docErr).includes('resource-exhausted')) {
        handleFirestoreError(docErr, OperationType.WRITE, `${DOCTORS_COL}/${doctor.id}`);
        return;
      }
      console.warn('Full doctor save to Firestore failed, attempting lighter fallback:', docErr);
      const lighterDoc = {
        ...cleanDoc,
        gallery: (cleanDoc.gallery || []).slice(0, 3),
        galleryItems: (cleanDoc.galleryItems || []).slice(0, 3),
        reviews: (cleanDoc.reviews || []).slice(0, 5),
        patients: (cleanDoc.patients || []).slice(0, 10),
      };
      await setDoc(docRef, lighterDoc, { merge: true });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${DOCTORS_COL}/${doctor.id}`);
  }
}

export async function deleteDoctorFromDb(doctorId: string): Promise<void> {
  // Always sync deletion with Supabase
  deleteDoctorFromSupabase(doctorId).catch((err) => {
    console.warn('Auto Supabase delete doctor warning:', err);
  });

  if (isFirestoreQuotaExceeded || !db) return;
  try {
    await deleteDoc(doc(db, DOCTORS_COL, doctorId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${DOCTORS_COL}/${doctorId}`);
  }
}

export async function seedDoctorsIfEmpty(initialDoctors: Doctor[]): Promise<void> {
  if (isFirestoreQuotaExceeded || !db) return;
  try {
    const snapshot = await withFirestoreTimeout(getDocs(collection(db, DOCTORS_COL)));
    if (snapshot.empty) {
      console.log('Seeding initial doctors to Firestore...');
      for (const docData of initialDoctors) {
        await saveDoctorInDb(docData);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, DOCTORS_COL);
  }
}

// --- APPOINTMENTS ---
export function subscribeAppointments(onData: (appointments: Appointment[]) => void): () => void {
  if (!db || isFirestoreQuotaExceeded) return () => {};
  const colRef = collection(db, APPOINTMENTS_COL);
  try {
    return onSnapshot(
      colRef,
      (snapshot) => {
        const appointments: Appointment[] = [];
        snapshot.forEach((docSnap) => {
          appointments.push({ id: docSnap.id, ...docSnap.data() } as Appointment);
        });
        onData(appointments);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, APPOINTMENTS_COL);
      },
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, APPOINTMENTS_COL);
    return () => {};
  }
}

export async function saveAppointmentInDb(appointment: Appointment): Promise<void> {
  // Always sync appointment to Supabase
  saveAppointmentToSupabase(appointment).catch((err) => {
    console.warn('Auto Supabase sync appointment warning:', err);
  });

  if (isFirestoreQuotaExceeded || !db) return;
  try {
    const docRef = doc(db, APPOINTMENTS_COL, appointment.id);
    const cleanApt = JSON.parse(JSON.stringify(appointment));
    await setDoc(docRef, cleanApt, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${APPOINTMENTS_COL}/${appointment.id}`);
  }
}

export async function deleteAppointmentFromDb(appointmentId: string): Promise<void> {
  // Always sync deletion with Supabase
  deleteAppointmentFromSupabase(appointmentId).catch((err) => {
    console.warn('Auto Supabase delete appointment warning:', err);
  });

  if (isFirestoreQuotaExceeded || !db) return;
  try {
    await deleteDoc(doc(db, APPOINTMENTS_COL, appointmentId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${APPOINTMENTS_COL}/${appointmentId}`);
  }
}

export async function seedAppointmentsIfEmpty(initialAppointments: Appointment[]): Promise<void> {
  if (isFirestoreQuotaExceeded || !db) return;
  try {
    const snapshot = await withFirestoreTimeout(getDocs(collection(db, APPOINTMENTS_COL)));
    if (snapshot.empty) {
      console.log('Seeding initial appointments to Firestore...');
      for (const apt of initialAppointments) {
        await saveAppointmentInDb(apt);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, APPOINTMENTS_COL);
  }
}

// --- LANDING CONFIG ---
export function subscribeLandingConfig(onData: (config: LandingPageConfig) => void): () => void {
  if (!db || isFirestoreQuotaExceeded) return () => {};
  const docRef = doc(db, LANDING_CONFIG_COL, 'main');
  try {
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onData(snapshot.data() as LandingPageConfig);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `${LANDING_CONFIG_COL}/main`);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `${LANDING_CONFIG_COL}/main`);
    return () => {};
  }
}

export async function saveLandingConfigInDb(landingConfig: LandingPageConfig): Promise<void> {
  // Always sync landing config to Supabase
  saveLandingConfigToSupabase(landingConfig).catch((err) => {
    console.warn('Auto Supabase sync landing config warning:', err);
  });

  if (isFirestoreQuotaExceeded || !db) return;
  try {
    const docRef = doc(db, LANDING_CONFIG_COL, 'main');
    const cleanConfig = JSON.parse(JSON.stringify(landingConfig));
    
    // Automatically compress any large data URL images before saving to Firestore
    let safeConfig = await compressObjectImages(cleanConfig, 700, 700, 0.7);
    
    // Check approximate byte size
    const jsonStr = JSON.stringify(safeConfig);
    if (jsonStr.length > 900000) {
      console.warn('Landing config size is large (' + jsonStr.length + ' bytes), applying aggressive compression...');
      safeConfig = await compressObjectImages(safeConfig, 400, 400, 0.55);
    }

    await setDoc(docRef, safeConfig, { merge: true });
  } catch (error) {
    console.error('Error saving landing config to Firestore:', error);
    // If it fails with size limit, try emergency fallback with lower quality
    try {
      const docRef = doc(db, LANDING_CONFIG_COL, 'main');
      const cleanConfig = JSON.parse(JSON.stringify(landingConfig));
      const ultraSafeConfig = await compressObjectImages(cleanConfig, 350, 350, 0.5);
      await setDoc(docRef, ultraSafeConfig, { merge: true });
      return;
    } catch (fallbackError) {
      handleFirestoreError(fallbackError, OperationType.WRITE, `${LANDING_CONFIG_COL}/main`);
    }
  }
}

export async function seedLandingConfigIfEmpty(initialConfig: LandingPageConfig): Promise<void> {
  if (isFirestoreQuotaExceeded || !db) return;
  try {
    const snapshot = await withFirestoreTimeout(getDocs(collection(db, LANDING_CONFIG_COL)));
    if (snapshot.empty) {
      console.log('Seeding initial landing config to Firestore...');
      await saveLandingConfigInDb(initialConfig);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, LANDING_CONFIG_COL);
  }
}

// --- BANNERS ---
export function subscribeBanners(onData: (banners: DoctorBanner[]) => void): () => void {
  if (!db || isFirestoreQuotaExceeded) return () => {};
  const colRef = collection(db, BANNERS_COL);
  try {
    return onSnapshot(
      colRef,
      (snapshot) => {
        const banners: DoctorBanner[] = [];
        snapshot.forEach((docSnap) => {
          banners.push({ id: docSnap.id, ...docSnap.data() } as DoctorBanner);
        });
        onData(banners);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, BANNERS_COL);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, BANNERS_COL);
    return () => {};
  }
}

export async function saveBannersInDb(banners: DoctorBanner[]): Promise<void> {
  // Always sync banners to Supabase
  saveBannersToSupabase(banners).catch((err) => {
    console.warn('Auto Supabase sync banners warning:', err);
  });

  if (isFirestoreQuotaExceeded || !db) return;
  try {
    for (const b of banners) {
      const docRef = doc(db, BANNERS_COL, b.id);
      const cleanB = JSON.parse(JSON.stringify(b));
      await setDoc(docRef, cleanB, { merge: true });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, BANNERS_COL);
  }
}

export async function deleteBannerFromDb(bannerId: string): Promise<void> {
  // Always sync deletion with Supabase
  deleteBannerFromSupabase(bannerId).catch((err) => {
    console.warn('Auto Supabase delete banner warning:', err);
  });

  if (isFirestoreQuotaExceeded || !db) return;
  try {
    await deleteDoc(doc(db, BANNERS_COL, bannerId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${BANNERS_COL}/${bannerId}`);
  }
}

export async function seedBannersIfEmpty(initialBanners: DoctorBanner[]): Promise<void> {
  if (isFirestoreQuotaExceeded || !db) return;
  try {
    const snapshot = await withFirestoreTimeout(getDocs(collection(db, BANNERS_COL)));
    if (snapshot.empty) {
      console.log('Seeding initial banners to Firestore...');
      await saveBannersInDb(initialBanners);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, BANNERS_COL);
  }
}

// --- SPECIALTIES ---
export function subscribeSpecialties(onData: (specialties: SystemSpecialty[]) => void): () => void {
  if (!db || isFirestoreQuotaExceeded) return () => {};
  const colRef = collection(db, SPECIALTIES_COL);
  try {
    return onSnapshot(
      colRef,
      (snapshot) => {
        const items: SystemSpecialty[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as SystemSpecialty);
        });
        onData(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, SPECIALTIES_COL);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, SPECIALTIES_COL);
    return () => {};
  }
}

export async function saveSpecialtiesInDb(specialties: SystemSpecialty[]): Promise<void> {
  if (isFirestoreQuotaExceeded || !db) return;
  try {
    for (const sp of specialties) {
      const docRef = doc(db, SPECIALTIES_COL, sp.id);
      const cleanSp = JSON.parse(JSON.stringify(sp));
      await setDoc(docRef, cleanSp, { merge: true });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, SPECIALTIES_COL);
  }
}

export async function seedSpecialtiesIfEmpty(initialSpecialties: SystemSpecialty[]): Promise<void> {
  if (isFirestoreQuotaExceeded || !db) return;
  try {
    const snapshot = await withFirestoreTimeout(getDocs(collection(db, SPECIALTIES_COL)));
    if (snapshot.empty) {
      console.log('Seeding initial specialties to Firestore...');
      await saveSpecialtiesInDb(initialSpecialties);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, SPECIALTIES_COL);
  }
}

// --- CONTACT MESSAGES ---
export function subscribeContactMessages(onData: (messages: any[]) => void): () => void {
  if (!db || isFirestoreQuotaExceeded) return () => {};
  const colRef = collection(db, CONTACT_MESSAGES_COL);
  try {
    return onSnapshot(
      colRef,
      (snapshot) => {
        const items: any[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() });
        });
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onData(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, CONTACT_MESSAGES_COL);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, CONTACT_MESSAGES_COL);
    return () => {};
  }
}

export async function saveContactMessageInDb(message: any): Promise<void> {
  if (isFirestoreQuotaExceeded || !db) return;
  try {
    const docRef = doc(db, CONTACT_MESSAGES_COL, message.id);
    const cleanMsg = JSON.parse(JSON.stringify(message));
    await setDoc(docRef, cleanMsg, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, CONTACT_MESSAGES_COL);
  }
}

export async function deleteContactMessageFromDb(messageId: string): Promise<void> {
  if (isFirestoreQuotaExceeded || !db) return;
  try {
    const docRef = doc(db, CONTACT_MESSAGES_COL, messageId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, CONTACT_MESSAGES_COL);
  }
}
