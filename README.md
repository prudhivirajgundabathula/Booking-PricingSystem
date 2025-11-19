Booking Pricing System

A full-stack workspace booking platform with conflict detection, dynamic pricing, cancellation rules, and admin analytics.

 Features
Backend (Node.js + Express + MongoDB + TypeScript)

Meeting room management

Booking creation

Real-time conflict detection

Dynamic hourly pricing

Booking cancellation rules

Admin analytics (usage + revenue)

Frontend (React + TypeScript + Material UI)

Rooms listing

Booking form

Booking cancellation

Analytics table

📂 Project Structure
Booking-PricingSystem/
│── backend/
│── frontend/
│── README.md
│── ARCHITECTURE.md

 Backend Setup
1. Requirements

Node.js ≥ 18

MongoDB Atlas account

2. Environment Variables

Create a .env file inside /backend:

PORT=8080
MONGO_URI=mongodb+srv://bookingPricing:securePassword123@cluster0.n6syfxk.mongodb.net/bookingDB?retryWrites=true&w=majority&appName=Cluster0


3. Install & Run Backend
cd backend
npm install
npm run dev or npx ts-node-dev index.ts  


Server runs at:

http://localhost:8080

 API Documentation
1️. Rooms API
Seed default rooms
POST /api/rooms/seed

Get all rooms
GET /api/rooms


Response:

[
  { "id": "1", "name": "Cabin 1", "baseHourlyRate": 300, "capacity": 4 }
]

2️. Create Booking
Endpoint
POST /api/bookings

Body
{
  "roomId": "676fe...",
  "userName": "Prudhvi",
  "startTime": "2025-11-20T10:00:00.000Z",
  "endTime": "2025-11-20T12:30:00.000Z"
}

Success Response
{
  "bookingId": "67abc...",
  "roomId": "676fe..",
  "userName": "Prudhvi",
  "totalPrice": 975,
  "status": "CONFIRMED"
}

Conflict Response
{
  "error": "Room already booked from 10:30:00 to 11:30:00"
}

3️. Cancel Booking
Endpoint
POST /api/bookings/:id/cancel

Rules

Cannot cancel if < 2 hrs to start time

Cancelled bookings excluded from analytics

Error
{ "error": "Cannot cancel within 2 hours of start time" }

4️. Analytics
Endpoint
GET /api/analytics?from=2025-11-01&to=2025-11-30

Response
[
  {
    "roomId": "676f...",
    "roomName": "Cabin 1",
    "totalHours": 15.5,
    "totalRevenue": 5250
  }
]

 Frontend Setup (React + TypeScript + Material UI)
1. Installation
cd frontend
npm install
npm run dev

Frontend runs at:

http://localhost:5173

☁️ Deployment Instructions
Backend (Render)

Go to https://render.com

Create new Web Service

Connect GitHub repo

Build Command:

npm install && npm run build


Start Command:

node dist/index.js


Add environment variables:

PORT

MONGO_URI

Frontend (Netlify)

Go to https://netlify.com

New Site → Import from Git

Build Command:

npm run build


Publish directory:

dist


Add environment variable:

VITE_API_BASE_URL=https://your-backend.onrender.com/api



