import express from 'express';
import { createBooking, cancelBooking } from '../controllers/bookingsController';
import Booking from '../models/Booking';
const router = express.Router();


router.get('/', async (_, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings', details: err });
  }
});

router.post('/', createBooking);
router.post('/:id/cancel', cancelBooking);

export default router;