# 📡 DriveX REST API Documentation (v1)

> **Base URL**: `http://localhost:5000/api/v1`  
> **Standard Response Format**:  
> Success: `{ "success": true, "data": { ... }, "message": "..." }`  
> Error: `{ "success": false, "error": { "code": "...", "message": "...", "details": [] } }`

---

## 🔐 1. Authentication Endpoints (`/auth`)

### 1.1 Register New User
- **Method**: `POST`
- **URL**: `/api/v1/auth/register`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "firstName": "Vikram",
  "lastName": "Malhotra",
  "email": "vikram@example.com",
  "phone": "+919876543210",
  "password": "Password@123"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOi...",
    "user": {
      "id": "66c34a...",
      "name": "Vikram Malhotra",
      "email": "vikram@example.com",
      "role": "user"
    }
  }
}
```
*(Sets HTTP-Only Cookie: `drivex_refresh_token`)*

---

### 1.2 User Login
- **Method**: `POST`
- **URL**: `/api/v1/auth/login`
- **Request Body**:
```json
{
  "email": "vikram@example.com",
  "password": "Password@123"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOi...",
    "user": {
      "id": "66c34a...",
      "name": "Vikram Malhotra",
      "email": "vikram@example.com",
      "role": "user"
    }
  }
}
```

---

### 1.3 Refresh Access Token
- **Method**: `POST`
- **URL**: `/api/v1/auth/refresh`
- **Cookie**: `drivex_refresh_token=<token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOi...",
    "user": { ... }
  }
}
```

---

### 1.4 Get Authenticated User Profile
- **Method**: `GET`
- **URL**: `/api/v1/auth/me`
- **Headers**: `Authorization: Bearer <accessToken>`

---

## 🚗 2. Vehicle Endpoints (`/vehicles`)

### 2.1 List & Filter Fleet
- **Method**: `GET`
- **URL**: `/api/v1/vehicles?type=car&category=SUV&city=Bhilai&sort=price_asc&page=1&limit=12`
- **Query Parameters**:
  - `type`: `car`, `bike`, `scooter`, `ev`
  - `brand`: `Mahindra`, `Hyundai`, `Royal Enfield`, `BMW`, etc.
  - `category`: `SUV`, `Sedan`, `Cruiser`, `Adventure`, `Convertible`
  - `fuelType`: `Petrol`, `Diesel`, `Electric`, `Hybrid`
  - `transmission`: `Automatic`, `Manual`
  - `minPrice`, `maxPrice`: Daily rental price bounds in INR
  - `minSeats`, `maxSeats`: Seating capacity
  - `city` / `location`: City hub name (`Bhilai`, `Raipur`, `Goa`, etc.)
  - `sort`: `recommended`, `price_asc`, `price_desc`, `rating`, `newest`
  - `page`, `limit`: Pagination parameters

---

### 2.2 Search Vehicles
- **Method**: `GET`
- **URL**: `/api/v1/vehicles/search?q=Thar`

---

### 2.3 Nearby Geospatial Vehicle Discovery
- **Method**: `GET`
- **URL**: `/api/v1/vehicles/nearby?lat=21.2121&lng=81.3629&radius=25`
- **Description**: Uses MongoDB `2dsphere` `$nearSphere` queries to return fleet availability within the given radius (in km).

---

### 2.4 Get Vehicle Details by ID
- **Method**: `GET`
- **URL**: `/api/v1/vehicles/:id`

---

## 📅 3. Booking Endpoints (`/bookings`)

### 3.1 Create Server-Authoritative Booking
- **Method**: `POST`
- **URL**: `/api/v1/bookings`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
```json
{
  "vehicleId": "66c34a...",
  "pickup": {
    "location": "Bhilai",
    "date": "2026-08-25",
    "time": "10:00"
  },
  "dropoff": {
    "location": "Bhilai",
    "date": "2026-08-28",
    "time": "10:00"
  },
  "driverOption": "self_drive",
  "driverInfo": {
    "fullName": "Vikram Malhotra",
    "email": "vikram@example.com",
    "phone": "+919876543210",
    "drivingLicense": "DL-042019008921",
    "deliveryAddress": "Civic Center Hub"
  },
  "selectedAddons": ["zero_dep", "unlimited_km"],
  "couponCode": "DRIVEX20",
  "paymentMethod": "upi"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "booking": {
      "bookingNumber": "DX-2026-849102",
      "status": "confirmed",
      "paymentStatus": "paid",
      "pricing": {
        "baseDailyRate": 4500,
        "baseRentalTotal": 13500,
        "addOnsTotal": 2498,
        "taxGST": 2429,
        "discountAmount": 2500,
        "refundableSecurityDeposit": 10000,
        "finalPayableAmount": 25927
      }
    }
  }
}
```

---

### 3.2 List My Bookings
- **Method**: `GET`
- **URL**: `/api/v1/bookings`
- **Headers**: `Authorization: Bearer <accessToken>`

---

### 3.3 Cancel Booking
- **Method**: `PATCH`
- **URL**: `/api/v1/bookings/:id/cancel`
- **Request Body**: `{ "reason": "Change of travel plans" }`

---

## 🗺️ 4. Geospatial & Location Endpoints (`/locations`)

- `GET /api/v1/locations/hubs`: Returns all official DriveX operating hubs across India.
- `GET /api/v1/locations/search?q=Bhilai`: Autocomplete address lookup.
- `GET /api/v1/locations/geocode?address=Bhilai`: Converts address string to `[lng, lat]`.
- `GET /api/v1/locations/reverse-geocode?lat=21.2121&lng=81.3629`: Converts coords to address.
- `POST /api/v1/locations/route`: Calculates route geometry, distance in km, and duration in minutes.
```json
{
  "origin": { "lat": 21.2121, "lng": 81.3629 },
  "destination": { "lat": 21.2514, "lng": 81.6296 }
}
```

---

## 💳 5. Payment Endpoints (`/payments`)

- `POST /api/v1/payments/create-order`: Generates Razorpay Order ID for a booking.
- `POST /api/v1/payments/verify`: Cryptographic verification of Razorpay HMAC SHA256 signature.
- `POST /api/v1/payments/webhook`: Server-to-server Razorpay webhook listener.

---

## 🛡️ 6. Admin Endpoints (`/admin`)

*(Requires `Authorization: Bearer <token>` where user has `role: "admin"`)*

- `GET /api/v1/admin/dashboard`: Real-time KPI stats (fleet counts, active bookings, revenue).
- `GET /api/v1/admin/users`: List all registered users.
- `GET /api/v1/admin/vehicles`: Full fleet overview.
- `POST /api/v1/admin/vehicles`: Add new vehicle to fleet.
- `PATCH /api/v1/admin/vehicles/:id`: Update vehicle specs/pricing.
- `DELETE /api/v1/admin/vehicles/:id`: Soft-delete vehicle from active fleet.
- `GET /api/v1/admin/bookings`: View all customer bookings.
- `PATCH /api/v1/admin/bookings/:id/status`: Update booking state (`active`, `completed`, `cancelled`).
- `GET /api/v1/admin/revenue`: Monthly aggregated revenue breakdown.
