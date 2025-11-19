import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // 

import bookingRoutes from './routes/bookings';
import analyticsRoutes from './routes/analytics';
import roomRoutes from './routes/rooms';

dotenv.config();
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://prudhiviraj-workspace.netlify.app']
}));
app.use(express.json());

app.use('/api/bookings', bookingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/rooms', roomRoutes);

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));