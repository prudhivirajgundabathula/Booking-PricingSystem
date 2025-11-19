import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Room from '../models/Room';

export async function getAnalytics(req: Request, res: Response) {
  try {
    const from = new Date(req.query.from as string);
    const to = new Date(req.query.to as string);

    const bookings = await Booking.find({
      status: 'CONFIRMED',
      startTime: { $gte: from },
      endTime: { $lte: to }
    });

    const roomStats: Record<string, { roomName: string, totalHours: number, totalRevenue: number }> = {};

    for (const booking of bookings) {
      const room = await Room.findById(booking.roomId);
      if (!room) continue; 

      const hours = (booking.endTime.getTime() - booking.startTime.getTime()) / 3600000;

      if (!roomStats[room.id]) {
        roomStats[room.id] = {
          roomName: room.name,
          totalHours: 0,
          totalRevenue: 0
        };
      }

      roomStats[room.id].totalHours += hours;
      roomStats[room.id].totalRevenue += booking.totalPrice;
    }

    res.json(
      Object.entries(roomStats).map(([roomId, stats]) => ({
        roomId,
        ...stats
      }))
    );
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to generate analytics' });
  }
}