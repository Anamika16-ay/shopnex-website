# ShopNex

A full-stack e-commerce web application built on the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Live Demo

https://online-voting-frontend-wpbn.onrender.com 

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Deployed as static build, served via Nginx

**Backend**
- Node.js + Express
- MongoDB (Atlas) with Mongoose
- JWT-based authentication
- AWS S3 for image storage

**Infrastructure**
- AWS EC2 (Amazon Linux)
- Nginx as reverse proxy
- PM2 for process management

## ✨ Features

- User authentication (signup/login) with JWT
- Product listing and browsing
- Admin panel for product management
- Image uploads to AWS S3
- Responsive UI

## 📁 Project Structure

```
shopnex-mern/
├── backend/          # Express API server
│   ├── routes/
│   ├── models/
│   ├── utils/
│   └── server.js
├── frontend/         # React (Vite) client
│   ├── src/
│   └── public/
└── README.md
```

## ⚙️ Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MongoDB URI, JWT secret, and AWS credentials in .env
npm run seed     # optional: seed sample data
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:5000/api" > .env
npm run dev
```

## 🔐 Environment Variables

The backend requires a `.env` file (see `.env.example`) with the following:

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Backend server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `CLIENT_URL` | Frontend URL (for CORS) |
| `AWS_ACCESS_KEY_ID` | AWS IAM access key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key |
| `AWS_REGION` | AWS region for S3 bucket |
| `AWS_S3_BUCKET` | S3 bucket name for product images |
| `AWS_S3_BASE_URL` | Public base URL of the S3 bucket |

> ⚠️ Never commit `.env` to version control. It's included in `.gitignore`.

## 📦 Deployment

This project is deployed on an AWS EC2 instance with:
- **PM2** managing the Node.js backend process
- **Nginx** serving the React build and reverse-proxying `/api` requests to the backend
- **MongoDB Atlas** as the hosted database

## 📄 License

This project is for educational/personal use.

## 👤 Author

Anamika Yadav
