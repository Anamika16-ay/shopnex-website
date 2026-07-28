# ShopNex — MERN Stack E-Commerce Application

Full rebuild of ShopNex using **MongoDB, Express.js, React, Node.js** — same features as the original PHP/MySQL version, now as a modern JWT-authenticated REST API with a React SPA frontend.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router 6, Axios, Bootstrap 5, Font Awesome, AOS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (separate tokens for customers and admins) |
| File Storage | AWS S3 (falls back to local disk storage automatically if no AWS keys are set) |

## Folder Structure

```
shopnex-mern/
├── backend/
│   ├── config/          # db.js (MongoDB connection), s3.js (image upload)
│   ├── models/           # Mongoose schemas: User, Admin, Category, Product, Cart, Wishlist, Order, Review, Contact
│   ├── middleware/       # auth.js, adminAuth.js, upload.js, errorHandler.js
│   ├── controllers/      # Business logic for every route
│   ├── routes/           # Express routers
│   ├── utils/            # generateToken.js, orderNumber.js, seedData.js
│   ├── server.js         # App entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/   # Header, Footer, ProductCard, AdminLayout, route guards
│   │   ├── context/      # AuthContext, CartContext, ToastContext, AdminAuthContext
│   │   ├── pages/         # All 20 customer pages + admin/ (6 admin pages)
│   │   ├── services/api.js
│   │   ├── App.jsx, main.jsx, index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Prerequisites

- **Node.js 18+** and npm — https://nodejs.org
- **MongoDB** — either:
  - Install locally: https://www.mongodb.com/try/download/community, or
  - Use a free **MongoDB Atlas** cluster: https://www.mongodb.com/cloud/atlas (recommended, no local install needed)

## Setup — Backend

```bash
cd backend
npm install

cp .env.example .env
# Edit .env and set:
#   MONGO_URI=mongodb://127.0.0.1:27017/shopnex   (local)
#   or MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/shopnex   (Atlas)
#   JWT_SECRET=<any long random string>

npm run seed     # populates sample categories, products, admin & demo user
npm run dev      # starts the API server on http://localhost:5000 (nodemon, auto-restarts)
```

Verify it's running: open `http://localhost:5000/api/health` — should return `{"status":"ok"}`.

## Setup — Frontend

Open a **second terminal**:

```bash
cd frontend
npm install
npm run dev      # starts the React dev server on http://localhost:5173
```

Open `http://localhost:5173` in your browser. The Vite dev server proxies all `/api` and `/uploads` requests to the backend on port 5000 automatically (see `vite.config.js`) — no CORS setup needed in development.

## Default Credentials (from seed script)

| Role | Email | Password |
|---|---|---|
| Admin | admin@shopnex.com | Admin@123 |
| Demo Customer | demo@example.com | User@123 |

Admin panel: `http://localhost:5173/admin/login`

> Change these credentials before any production deployment.

## Environment Variables (Backend `.env`)

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/shopnex
JWT_SECRET=change_this_to_a_long_random_secret_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Optional — AWS S3 for product images (falls back to local /backend/uploads if omitted)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
AWS_S3_BUCKET=
AWS_S3_BASE_URL=
```

## API Overview

All endpoints are prefixed with `/api`.

| Resource | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `PUT /auth/me`, `POST /auth/forgot-password`, `POST /auth/reset-password` |
| Products | `GET /products`, `GET /products/:slug`, `GET /products/home/sections` |
| Categories | `GET /categories` |
| Cart | `GET /cart`, `POST /cart`, `PUT /cart/:itemId` *(auth required)* |
| Wishlist | `GET /wishlist`, `POST /wishlist/toggle` *(auth required)* |
| Orders | `POST /orders`, `GET /orders`, `GET /orders/:orderNumber` *(auth required)* |
| Reviews | `POST /reviews` *(auth required)* |
| Contact | `POST /contact` |
| Admin Auth | `POST /admin/auth/login` |
| Admin | `GET /admin/dashboard`, `GET/POST/PUT/DELETE /admin/products`, `GET/PUT /admin/orders`, `GET/PUT /admin/customers`, `GET /admin/reports` *(admin token required)* |

Customer routes use a `Bearer` JWT from `/auth/login` or `/auth/register`. Admin routes use a separate `Bearer` JWT from `/admin/auth/login`. The frontend's `api.js` service automatically attaches the correct token based on the request URL.

## Production Build

**Backend:** `npm start` (runs `node server.js`, no auto-restart).

**Frontend:**
```bash
cd frontend
npm run build       # outputs static files to frontend/dist
npm run preview      # preview the production build locally
```
Deploy `frontend/dist` to any static host (S3 + CloudFront, Vercel, Netlify, Nginx, etc.), and point `VITE_API_URL` (in a `.env` file, before building) to your deployed backend's URL, e.g. `https://api.yourdomain.com/api`. Deploy the `backend/` folder to any Node host (EC2, Render, Railway, Elastic Beanstalk) with MongoDB Atlas as the database.

## Security Notes

- Passwords hashed with `bcryptjs`
- JWT-based stateless authentication (7-day expiry by default)
- Rate limiting on login/forgot-password endpoints (`express-rate-limit`)
- `helmet` for security headers, `cors` scoped to `CLIENT_URL`
- Mongoose schema validation on all models
- Multer file-type/size validation on image uploads (JPG/PNG/WEBP, 5MB max)

## Differences from the PHP/MySQL Version

- **Auth**: JWT tokens in `localStorage` instead of PHP sessions/cookies.
- **Database**: MongoDB documents instead of MySQL relational tables — `Order.items` and `Cart.items` are embedded arrays rather than separate `order_items`/`cart` join tables.
- **Rendering**: Client-side rendered React SPA instead of server-rendered PHP pages — one `index.html`, all routing happens in the browser via React Router.
- **Image uploads**: Same S3-with-local-fallback strategy, now via `multer` + `aws-sdk` instead of PHP's native file handling.
