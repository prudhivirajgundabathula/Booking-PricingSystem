import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Room from '../models/Room';
import { isConflict, calculatePrice } from '../services/bookingService';

export async function createBooking(req: Request, res: Response) {
  const { roomId, userName, startTime, endTime } = req.body;
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start >= end || (end.getTime() - start.getTime()) / 3600000 > 12) {
    return res.status(400).json({ error: 'Invalid time range' });
  }

  const conflict = await isConflict(roomId, start, end);
  if (conflict) {
    return res.status(409).json({ error: `Room already booked from ${conflict.startTime} to ${conflict.endTime}` });
  }

  const room = await Room.findById(roomId);
  const totalPrice = calculatePrice(start, end, room!.baseHourlyRate);

  const booking = await Booking.create({ roomId, userName, startTime, endTime, totalPrice });
  res.json({ bookingId: booking._id, roomId, userName, totalPrice, status: booking.status });
}

export async function cancelBooking(req: Request, res: Response) {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const now = new Date();
  if ((booking.startTime.getTime() - now.getTime()) < 7200000) {
    return res.status(400).json({ error: 'Cannot cancel within 2 hours of start time' });
  }

  booking.status = 'CANCELLED';
  await booking.save();
  res.json({ message: 'Booking cancelled' });
}