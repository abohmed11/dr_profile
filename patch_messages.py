import re

# 1. Add type to types.ts
with open('src/types.ts', 'r') as f:
    content = f.read()

if "export interface ContactMessage" not in content:
    content += """\nexport interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  read: boolean;
}\n"""
    with open('src/types.ts', 'w') as f:
        f.write(content)

# 2. Add Firebase functions
with open('src/lib/firebase.ts', 'r') as f:
    fb = f.read()

if "CONTACT_MESSAGES_COL" not in fb:
    fb = fb.replace("const SPECIALTIES_COL = 'specialties';", "const SPECIALTIES_COL = 'specialties';\nconst CONTACT_MESSAGES_COL = 'contactMessages';")
    
    fb += """
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
"""
    with open('src/lib/firebase.ts', 'w') as f:
        f.write(fb)
