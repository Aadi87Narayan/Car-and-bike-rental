/**
 * Date and Duration Utility Functions
 */

export function calculateRentalDuration(pickupDateStr, pickupTimeStr, dropoffDateStr, dropoffTimeStr) {
  const pickup = new Date(`${pickupDateStr}T${pickupTimeStr || '10:00'}:00`);
  const dropoff = new Date(`${dropoffDateStr}T${dropoffTimeStr || '10:00'}:00`);

  if (isNaN(pickup.getTime()) || isNaN(dropoff.getTime())) {
    throw new Error('Invalid date or time format. Use YYYY-MM-DD and HH:mm');
  }

  const diffMs = dropoff.getTime() - pickup.getTime();
  if (diffMs <= 0) {
    throw new Error('Drop-off date and time must be after pick-up date and time');
  }

  const totalHours = Math.ceil(diffMs / (1000 * 60 * 60));
  const totalDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const totalWeeks = Math.floor(totalDays / 7);

  return {
    pickupDateTime: pickup,
    dropoffDateTime: dropoff,
    totalHours,
    totalDays,
    totalWeeks,
    diffMs
  };
}

export function isDateOverlap(startA, endA, startB, endB) {
  return new Date(startA) < new Date(endB) && new Date(endA) > new Date(startB);
}
