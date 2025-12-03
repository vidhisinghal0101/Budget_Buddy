# Full-Stack Authentication App

A modern authentication system with React frontend and Node.js backend using Prisma ORM, JWT, and Neon PostgreSQL database.

## Features

- 🔐 JWT Authentication
- 🎨 Clean UI with Tailwind CSS (blue, cyan, emerald, teal color scheme)
- 📱 Responsive design
- 🔒 Secure password hashing with bcrypt
- 🗄️ Neon PostgreSQL database with Prisma ORM

## Setup Instructions

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your Neon database URL:
   - Go to [Neon Console](https://console.neon.tech/)
   - Create a new project
   - Copy the connection string
   - Paste it in `.env` as `DATABASE_URL`

5. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma db push
```

6. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Usage

1. Open `http://localhost:3000` in your browser
2. Click "Sign up" to create a new account
3. Fill in your details and submit
4. You'll be automatically logged in and redirected to the dashboard
5. Use "Logout" to sign out

## Tech Stack

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL (Neon)
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Vite

## API Endpoints

- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/health` - Health check

## Color Scheme

- Login: Blue & Cyan gradients
- Signup: Emerald & Teal gradients
- Dashboard: Slate & Gray with accent colors
