import crypto from 'crypto';

/**
 * Generates human-readable, unique booking numbers like DX-2026-894210
 */
export function generateBookingNumber() {
  const year = new Date().getFullYear();
  const randomSixDigits = crypto.randomInt(100000, 999999);
  return `DX-${year}-${randomSixDigits}`;
}
