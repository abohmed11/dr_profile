/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Doctor, addSubscriptionDuration } from '../types';

/**
 * 7 Days in Milliseconds: 7 * 24 * 60 * 60 * 1000
 */
export const TRIAL_PERIOD_DAYS = 7;
export const TRIAL_PERIOD_MS = TRIAL_PERIOD_DAYS * 24 * 60 * 60 * 1000;

/**
 * Calculate Trial End Timestamp for a Doctor
 */
export function getDoctorTrialEndTimestamp(doctor: Doctor): number {
  if (doctor.trialEndDate) {
    const parsed = new Date(doctor.trialEndDate).getTime();
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  
  if (doctor.registeredAt) {
    const parsed = new Date(doctor.registeredAt).getTime();
    if (!isNaN(parsed) && parsed > 0) {
      return parsed + TRIAL_PERIOD_MS;
    }
  }

  // Fallback if doctor id has timestamp (e.g. doc-1740000000000)
  const idTimestampMatch = doctor.id?.match(/doc-(\d+)/);
  if (idTimestampMatch && idTimestampMatch[1]) {
    const ts = parseInt(idTimestampMatch[1], 10);
    if (!isNaN(ts) && ts > 0) {
      return ts + TRIAL_PERIOD_MS;
    }
  }

  return Date.now() + TRIAL_PERIOD_MS;
}

/**
 * Check if the doctor's 7-day free trial is currently active
 */
export function isDoctorTrialActive(doctor: Doctor): boolean {
  if (doctor.isPaidSubscription) return false;
  const trialEnd = getDoctorTrialEndTimestamp(doctor);
  return Date.now() <= trialEnd;
}

/**
 * Check if the doctor's 7-day free trial has expired and account is not paid
 */
export function isDoctorTrialExpired(doctor: Doctor): boolean {
  if (doctor.isPaidSubscription) return false;
  const trialEnd = getDoctorTrialEndTimestamp(doctor);
  return Date.now() > trialEnd;
}

/**
 * Get remaining trial days (0 if expired or paid)
 */
export function getDoctorRemainingTrialDays(doctor: Doctor): number {
  if (doctor.isPaidSubscription) return 0;
  const trialEnd = getDoctorTrialEndTimestamp(doctor);
  const diffMs = trialEnd - Date.now();
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Check if doctor profile is publicly visible to visitors
 * Rules:
 * 1. Must not be suspended or rejected by admin.
 * 2. If isPaidSubscription and isActiveSubscription is true -> Visible.
 * 3. If within active 7-day trial -> Visible.
 * 4. If trial expired and not paid -> Hidden (false).
 */
export function isDoctorProfilePubliclyVisible(doctor: Doctor): boolean {
  // If explicitly suspended or rejected
  if (
    doctor.status === 'suspended' ||
    doctor.status === 'rejected' ||
    doctor.approvalStatus === 'rejected' ||
    doctor.approvalStatus === 'suspended'
  ) {
    return false;
  }

  // If paid active subscription
  if (doctor.isPaidSubscription && doctor.isActiveSubscription) {
    if (doctor.subscriptionEndDate) {
      const endMs = new Date(doctor.subscriptionEndDate).getTime();
      if (!isNaN(endMs) && Date.now() > endMs) {
        return false;
      }
    }
    return true;
  }

  // If within the 7-day free trial
  if (isDoctorTrialActive(doctor)) {
    return doctor.isActiveSubscription !== false;
  }

  // If 7-day free trial has expired and no paid subscription
  if (isDoctorTrialExpired(doctor)) {
    return false;
  }

  return doctor.isActiveSubscription;
}

/**
 * Helper to activate / renew a doctor's subscription (annual = 12 months, 6months = 6 months)
 */
export function createPaidSubscriptionUpdate(
  doctor: Doctor,
  durationType: 'annual' | '6months' = 'annual'
): Doctor {
  const now = new Date();
  let baseDate = now;
  if (doctor.isPaidSubscription && !doctor.isTrial && doctor.subscriptionEndDate) {
    const existingExpiry = new Date(doctor.subscriptionEndDate);
    if (!isNaN(existingExpiry.getTime()) && existingExpiry > now) {
      baseDate = existingExpiry;
    }
  }
  const newExpiry = addSubscriptionDuration(baseDate, durationType);
  const expiryFormatted = newExpiry.toISOString().slice(0, 10);

  return {
    ...doctor,
    isPaidSubscription: true,
    isActiveSubscription: true,
    isTrial: false,
    subscriptionType: durationType,
    subscriptionEndDate: expiryFormatted,
    approvalStatus: 'approved',
    status: 'approved'
  };
}
