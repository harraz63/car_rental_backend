# 🚗 Car Rental System API

A scalable RESTful API built with **Express + TypeScript + MongoDB** featuring a full Admin Approval workflow for cars and rentals.

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) |
| Validation | Joi |
| Password | bcryptjs |
| Logging | Morgan |

---

## 🏗️ Project Structure

```
src/
├── index.ts                        ← Server entry point
├── app.ts                          ← Express app & middleware setup
├── config/
│   ├── db.ts                       ← MongoDB connection
│   └── seed.ts                     ← Admin user seeder
├── types/
│   ├── index.ts                    ← Shared enums & interfaces
│   └── express.d.ts                ← req.user type extension
├── utils/
│   └── appError.ts                 ← AppError class + asyncHandler
├── middlewares/
│   ├── auth.middleware.ts          ← JWT authentication
│   ├── role.middleware.ts          ← Role-based authorization
│   ├── validate.middleware.ts      ← Joi validation factory
│   └── error.middleware.ts         ← Global error handler
└── modules/
    ├── auth/
    │   ├── models/user.model.ts
    │   ├── services/auth.service.ts
    │   ├── controllers/auth.controller.ts
    │   ├── routes/auth.routes.ts
    │   └── validation/auth.validation.ts
    ├── cars/
    │   ├── models/car.model.ts
    │   ├── services/car.service.ts
    │   ├── controllers/car.controller.ts
    │   ├── routes/car.routes.ts
    │   └── validation/car.validation.ts
    └── rentals/
        ├── models/rental.model.ts
        ├── services/rental.service.ts
        ├── controllers/rental.controller.ts
        ├── routes/rental.routes.ts
        └── validation/rental.validation.ts
```

---

## ⚙️ Setup & Installation

### 1. Clone & install

```bash
git clone <your-repo-url>
cd car-rental-system
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/car-rental
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 3. Seed admin user

```bash
npm run seed
```

This creates:
- **Email:** `admin@carrental.com`
- **Password:** `Admin@12345`

### 4. Start development server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
npm start
```

---

## 🔐 Authentication

All protected routes require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### Roles

| Role | Description |
|------|-------------|
| `user` | Can browse approved cars and request rentals |
| `owner` | Can add cars and view their own listings |
| `admin` | Can approve/reject cars and rentals, edit cars |

---

## 🌐 API Reference

Base URL: `http://localhost:3000/api/v1`

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup-user` | ❌ | Register as a user |
| POST | `/auth/signup-owner` | ❌ | Register as a car owner |
| POST | `/auth/login` | ❌ | Login and receive JWT |

#### POST `/auth/signup-user`
```json
{
  "name": "Ahmed Mohamed",
  "email": "ahmed@example.com",
  "password": "password123"
}
```

#### POST `/auth/login`
```json
{
  "email": "ahmed@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": { "_id": "...", "name": "Ahmed", "email": "...", "role": "user" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Car Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/cars` | USER | Browse all approved cars |
| POST | `/cars` | OWNER | Submit a new car (status → pending) |
| GET | `/cars/my` | OWNER | View own car listings |
| GET | `/cars/pending` | ADMIN | View all pending cars |
| PATCH | `/cars/:id/approve` | ADMIN | Approve a car |
| PATCH | `/cars/:id/reject` | ADMIN | Reject a car |
| PATCH | `/cars/:id` | ADMIN | Edit any car field |

#### POST `/cars` — Create Car (OWNER)
```json
{
  "brand": "Toyota",
  "model": "Camry",
  "year": 2022,
  "color": "White",
  "dailyPrice": 150,
  "location": "Cairo",
  "description": "Well maintained family sedan",
  "numberOfSeats": 5,
  "engine": "2.5L",
  "transmission": "automatic",
  "fuelType": "petrol",
  "images": [
    "https://example.com/car1.jpg",
    "https://example.com/car2.jpg"
  ]
}
```

#### PATCH `/cars/:id/reject` — Reject Car (ADMIN)
```json
{
  "reason": "Images are unclear, please resubmit."
}
```

---

### Rental Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/rentals` | USER | Request a rental |
| GET | `/rentals/my` | USER | View own rental history |
| GET | `/rentals/pending` | ADMIN | View all pending rentals |
| PATCH | `/rentals/:id/approve` | ADMIN | Approve a rental |
| PATCH | `/rentals/:id/reject` | ADMIN | Reject a rental |

#### POST `/rentals` — Request Rental (USER)
```json
{
  "carId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "startDate": "2026-05-01",
  "endDate": "2026-05-07"
}
```

**Response includes auto-calculated `totalPrice`:**
```json
{
  "status": "success",
  "data": {
    "rental": {
      "carId": { "brand": "Toyota", "model": "Camry", "dailyPrice": 150 },
      "startDate": "2026-05-01",
      "endDate": "2026-05-07",
      "totalPrice": 900,
      "status": "pending"
    }
  }
}
```

---

## 🧱 Business Rules

- Cars are created with `status: "pending"` — invisible to users until admin approves
- Only **OWNER** role can create cars
- Only **ADMIN** can approve, reject, or edit cars
- Only approved cars can be rented
- Rental system checks for **date conflicts** — overlapping approved rentals are blocked
- `totalPrice` is calculated server-side: `dailyPrice × rental days`
- Rejected cars/rentals can optionally include a `reason` message

---

## 🛡️ Validation Rules

| Field | Rule |
|-------|------|
| `year` | Integer, min 1990, max current year + 1 |
| `dailyPrice` | Positive number, > 0 |
| `images` | Array of valid URLs, at least 1 required |
| `transmission` | `"automatic"` or `"manual"` |
| `fuelType` | `"petrol"`, `"diesel"`, or `"hybrid"` |
| `startDate` | Must be in the future |
| `endDate` | Must be after `startDate` |

---

## 🔥 Error Responses

All errors follow this format:

```json
{
  "status": "error",
  "message": "Descriptive error message here"
}
```

| Code | Meaning |
|------|---------|
| 400 | Bad request / validation failed |
| 401 | Unauthenticated |
| 403 | Forbidden (wrong role) |
| 404 | Resource not found |
| 409 | Conflict (duplicate email, booking overlap) |
| 422 | Unprocessable entity (Joi validation) |
| 500 | Internal server error |

---

## 📋 npm Scripts

```bash
npm run dev      # Start dev server with hot reload
npm run build    # Compile TypeScript → dist/
npm start        # Run compiled production build
npm run seed     # Seed admin user into database
```
