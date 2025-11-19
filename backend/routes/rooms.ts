import express from 'express';
import Room from '../models/Room';
const router = express.Router();

router.get('/', async (_, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

router.post('/seed', async (_, res) => {
  await Room.deleteMany({});
  await Room.insertMany([
    { name: 'Focus Pod', baseHourlyRate: 300, capacity: 4 },
    { name: 'Sprint', baseHourlyRate: 250, capacity: 3 },
    { name: 'CII Investors', baseHourlyRate: 10000, capacity: 1000 },
    { name: 'Summit Room', baseHourlyRate: 1000, capacity: 100 },
    { name: 'Board Room', baseHourlyRate: 500, capacity: 50 },
    { name: 'Think Tank', baseHourlyRate: 1500, capacity: 30 }
  ]);
  res.json({ message: 'Rooms seeded' });
});


router.post('/', async (req, res) => {
  try {
    const { name, baseHourlyRate, capacity } = req.body;
    const room = await Room.create({ name, baseHourlyRate, capacity });
    res.json(room);
  } catch (err) {
    res.status(400).json({ error: 'Unable to create room', details: err });
  }
});


export default router;