# 🚗🏍️ DriveX Backend — Production-Ready India-First Vehicle Rental API

A robust, enterprise-grade Node.js, Express, and MongoDB REST API backend built specifically for the **DriveX India Vehicle Rental Platform** (Cars, Bikes, Scooters, and Electric Vehicles).

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
cd drivex-backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Seed Database with Indian Fleet & Hubs
```bash
npm run seed
```
This populates:
- **11 Major Indian Mobility Hubs** (Bhilai, Raipur, Durg, Nagpur, Indore, Pune, Mumbai, Delhi, Bengaluru, Hyderabad, Goa).
- **20+ Authentic Indian Vehicles** (Cars: Swift, Creta, Thar, Thar ROXX, Scorpio-N, XUV700, Fortuner, BMW X5, Mercedes C-Class, Porsche 911; Bikes: Royal Enfield Classic 350, Himalayan 450, Yamaha MT-15, KTM Duke 390; Scooters & EVs: Activa 6G, Ola S1 Pro, Ather 450X).
- **SuperAdmin Account**: `admin@drivex.in` / `AdminDriveX@2026`.

### 4. Run Development Server
```bash
npm run dev
```
The server will start on: **`http://localhost:5000`**  
Health Check: **`http://localhost:5000/api/v1/health`**

### 5. Run Automated Tests
```bash
npm test
```

---

## 🏗️ Architecture & Security Highlights

### 🛡️ Server-Authoritative Pricing
- **Zero Client Trust**: All rental prices, GST taxes (18%), duration calculations, vehicle-type add-ons, and refundable security deposits are computed authoritatively on the backend by `pricingService.js`.
- Client tampering (e.g. attempting to send `price: 1` or `paymentStatus: 'paid'`) is completely ignored.

### 🔐 Multi-Tier Authentication
- **Bcrypt Hashing**: 12 salt rounds, zero plaintext passwords stored.
- **Short-Lived JWT Access Token**: 15 minutes validity.
- **Secure HTTP-Only Refresh Cookie**: 7 days validity with `SameSite=Lax` / `SameSite=None` protection against XSS and token theft.
- **Admin Guards**: Strict role authorization (`adminMiddleware.js`) blocking non-admins from `/api/v1/admin/*`.

### 🗺️ Geospatial Proximity Discovery
- Vehicles and Hubs are indexed with MongoDB **`2dsphere` GeoJSON**.
- Execute proximity queries via `GET /api/v1/vehicles/nearby?lat=21.2121&lng=81.3629&radius=25` to find nearest available fleet vehicles within seconds.
- Integrated with Geoapify, OpenStreetMap Nominatim, and OSRM routing with offline mathematical fallbacks.

### 💳 Payment Abstraction
- Integrated with **Razorpay India** with HMAC SHA256 cryptographic signature validation and server-to-server webhook support.

---

## 📂 Project Structure

```
drivex-backend/
├── src/
│   ├── config/              # db.js, env.js, cors.js
│   ├── controllers/         # auth, vehicle, booking, location, payment, admin, etc.
│   ├── middleware/          # auth, admin, error, rateLimit, validation, upload
│   ├── models/              # User, Vehicle, Booking, Location, Payment, Review, Favorite, Document
│   ├── routes/v1/           # /api/v1 route definitions
│   ├── seed/                # seedLocations.js, seedVehicles.js, seedAdmin.js, index.js
│   ├── services/            # authService, pricingService, bookingService, mapService, paymentService
│   ├── utils/               # bookingNumber.js, dateUtils.js, response.js
│   ├── validators/          # express-validator schemas
│   ├── app.js               # Express application pipeline
│   └── server.js            # Server startup & graceful shutdown
├── tests/
│   └── api.test.js          # Automated business logic tests
├── docs/
│   └── API.md               # Full API endpoint documentation
├── .env.example
├── package.json
└── README.md
```

---

## 🔌 Connecting to the React Frontend

In the React Vite frontend (`src/services/api.js`), configure Axios with `withCredentials: true`:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // Sends HTTP-only refresh cookies automatically
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Bearer Access Token to outgoing requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('drivex_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatically refresh token on 401 response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          'http://localhost:5000/api/v1/auth/refresh',
          {},
          { withCredentials: true }
        );
        const newToken = res.data.data.accessToken;
        localStorage.setItem('drivex_access_token', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem('drivex_access_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🚀 Production Deployment Checklist

1. Set `NODE_ENV=production` in production environment.
2. Provide a production MongoDB Atlas URI in `MONGO_URI`.
3. Set high-entropy 64+ char random strings for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.
4. Set `FRONTEND_URL` to your production frontend domain (e.g., `https://drivex.in`).
5. Configure cloud object storage (e.g. AWS S3 or Cloudinary) for uploaded vehicle and KYC documents.
