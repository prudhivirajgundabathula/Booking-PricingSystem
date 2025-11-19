ARCHITECTURE.md
Booking & Pricing System – Architecture Overview
1. Tech Stack
Backend

Node.js + TypeScript

Express.js

MongoDB (Mongoose ODM)

dotenv

Layered architecture: Controllers → Services → Models → Utils

Frontend

React (Vite)

Material UI

Axios

Centralized API service under src/api/

2. Data Model
Room Model
{
  _id: ObjectId,
  roomId: string,
  name: string,
  basePricePerHour: number
}

Booking Model
{
  _id: ObjectId,
  roomId: string,
  userName: string,
  startTime: Date,
  endTime: Date,
  totalHours: number,
  totalPrice: number,
  status: "CONFIRMED" | "CANCELLED"
}

Derived Fields:

totalHours = (endTime - startTime) / 3600000

totalPrice = dynamicPricing(totalHours, room.basePricePerHour)

3. Core Business Logic
3.1 Time Conflict Checking

Two bookings conflict if:

(NewStart < ExistingEnd) AND (NewEnd > ExistingStart)


Service ensures:

Only CONFIRMED bookings are checked.

Cancelled bookings do not block time slots.

3.2 Dynamic Pricing Logic
Pricing Rules
Total Hours	Multiplier
≤ 2 hours	1× (base rate)
2–5 hours	1.2×
> 5 hours	1.5×
Formula
totalPrice = basePricePerHour × totalHours × multiplier

3.3 Cancellation Rules

Only allowed if request is made ≥ 2 hours before startTime

Otherwise → 400 Bad Request

Cancelled bookings:

status: "CANCELLED"

Excluded from analytics

Excluded from conflict checks

4. REST API Design
Room APIs
GET /api/rooms

Fetch all rooms.

Booking APIs
Create Booking

POST /api/bookings

Validates:

Input

Room exists

Time conflict

Pricing calculation

Cancel Booking

POST /api/bookings/:id/cancel

Rules:

Only if >2 hours before startTime

Otherwise error:

400 { message: "Cancellation allowed only before 2 hours of start time" }

Get Bookings

GET /api/bookings?roomId=101&status=CONFIRMED

Used by frontend for scheduler view.

Analytics API
Date-based revenue summary

GET /api/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD

Returns:

[
  {
    "roomId": "101",
    "roomName": "Cabin 1",
    "totalHours": 15.5,
    "totalRevenue": 5250
  }
]


Only CONFIRMED bookings counted.

Cancelled bookings are ignored.

5. Backend Architecture Layout
backend/
├── controllers/
│   ├── bookingController.ts
│   ├── roomController.ts
│   └── analyticsController.ts
├── services/
│   ├── bookingService.ts
│   ├── roomService.ts
│   └── analyticsService.ts
├── models/
│   ├── Room.ts
│   └── Booking.ts
├── routes/
│   ├── bookingRoutes.ts
│   ├── roomRoutes.ts
│   └── analyticsRoutes.ts
├── utils/
│   ├── pricing.ts
│   └── timeUtils.ts
├── index.ts
├── tsconfig.json
└── .env

Why this design?

Clear separation of concerns

Easy to scale features

Service layer holds all business logic (not controllers)

Controllers stay thin and focused on HTTP I/O

6. Frontend Architecture
frontend/
├── src/
│   ├── api/
│   │   └── api.ts
│   ├── components/
│   │   ├── BookingForm.tsx
│   │   ├── BookingList.tsx
│   │   ├── RoomList.tsx
│   │   └── AnalyticsView.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Bookings.tsx
│   │   ├── Rooms.tsx
│   │   └── Analytics.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── public/
└── package.json

Material UI

Forms

Tables

Date/Time pickers

Dialogs

Snackbar for notifications

7. Scaling Considerations
Database Scaling

Use MongoDB indexes:

roomId

startTime

status

Partition bookings by month/year for faster analytics

API Scaling

Introduce Redis caching for analytics

Introduce Rate limiting for public endpoints

Break into microservices if needed:

booking-service

analytics-service

File & Logging

Winston logs

S3 storage for logs (optional)

Retention policy for booking history

8. AI Usage Notes

AI could be used for:

Predictive pricing

Suggesting optimal slots for users

Auto-detection of overbooking attempts

Identifying peak hours and adjusting multipliers dynamically

Automated reporting through summary generation

9. Security Considerations

Validate all inputs with Zod or manual checks

.env protected and never committed

CORS restricted to allowed frontend domains

Helmet for HTTP header hardening

Sanitization against NoSQL injections

10. Deployment Strategy
Backend:

Host on Render / Railway / AWS EC2

MongoDB Atlas

PM2 for process management

Frontend:

Vercel or Netlify

Environment variable:

VITE_API_BASE_URL=https://your-backend-url/api

CI/CD

GitHub Actions:

Lint + Test on every push

Auto-deploy frontend/backend on main branch merge