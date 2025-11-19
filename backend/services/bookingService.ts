import Booking from '../models/Booking';
import Room from '../models/Room';

export async function isConflict(roomId: string, start: Date, end: Date) {
  const conflict = await Booking.findOne({
    roomId,
    status: 'CONFIRMED',
    $or: [
      { startTime: { $lt: end }, endTime: { $gt: start } }
    ]
  });
  return conflict;
}

export function calculatePrice(start: Date, end: Date, baseRate: number): number {
  const peakHours = [10, 11, 12, 16, 17, 18];
  let total = 0;
  const current = new Date(start);

  while (current < end) {
    const isPeak = peakHours.includes(current.getUTCHours()) && current.getUTCDay() >= 1 && current.getUTCDay() <= 5;
    total += isPeak ? baseRate * 1.5 : baseRate;
    current.setUTCHours(current.getUTCHours() + 1);
  }

  return total;
}