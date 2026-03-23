# Marent Car Rental Web App

Marent is a car rental web application built with React, TypeScript, and Vite. It supports browsing and searching cars, booking flows, wishlists, user profiles, notifications, and an admin area for fleet and customer operations.

**Key Features**

- Car discovery with search filters (pickup, dropoff)
- Popular and recommended car sections
- Booking flow with status tracking and booking details
- Wishlist and saved cars
- User profile, notifications, and feedback history
- Admin dashboard with cars, bookings, customers, feedbacks, and notifications
- Firebase Auth and Realtime Database integration
- Light/dark theme toggle and responsive UI

**Tech Stack**

- React 19 + TypeScript
- Vite
- Redux Toolkit
- React Router
- Firebase (Auth, Realtime Database)
- Tailwind CSS
- React Toastify, Swiper

**Environment Variables**
Create a `.env` file in the project root with the following keys:

- `VITE_API_KEY`
- `VITE_AUTH_DOMAIN`
- `VITE_PROJECT_ID`
- `VITE_DATABASE_URL`
- `VITE_STORAGE_BUCKET`

**Getting Started**

1. Install dependencies: `npm install`
1. Start the dev server: `npm run dev`
1. Build for production: `npm run build`
1. Preview the production build: `npm run preview`

**Available Routes**

- `/` home and search
- `/all-cars` browse the fleet
- `/search` search results
- `/book-now` booking flow
- `/wishlist` saved cars
- `/profile` user profile
- `/my-bookings` booking history
- `/my-feedbacks` feedback history
- `/notifications` user notifications
- `/admin` admin dashboards

**Project Notes**

- The app reads and writes data via Firebase Realtime Database.
- Admin routes are protected by `AdminRoute` in `src/components/AdminRoute.tsx`.
