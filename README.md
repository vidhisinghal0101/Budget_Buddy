# Budget Buddy 💰

A full-stack personal finance management application to track income, expenses, and manage your budget effectively.

## Features

- 🔐 JWT Authentication (Login/Signup)
- 💳 Transaction Management (CRUD Operations)
- 🔍 Search transactions by name/description
- 🎯 Filter by amount range, type, and category
- 📊 Sort by date, amount, or name (ascending/descending)
- 📄 Pagination for transaction history
- 📈 Financial statistics dashboard
- 💰 Estimated in-hand salary calculation
- 🎨 Clean UI with Tailwind CSS
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

### Authentication
- `POST /api/auth/signup` - Register new user (Public)
- `POST /api/auth/login` - Login user (Public)

### Transactions (Protected)
- `GET /api/transaction` - Get all transactions with filters (Authenticated)
  - Query params: search, minAmount, maxAmount, type, category, sortBy, order, page, limit
- `GET /api/transaction/:id` - Get single transaction (Authenticated)
- `POST /api/transaction` - Create transaction (Authenticated)
- `PUT /api/transaction/:id` - Update transaction (Authenticated)
- `DELETE /api/transaction/:id` - Delete transaction (Admin/Owner only)
- `GET /api/transaction/stats/summary` - Get financial statistics (Authenticated)
- `GET /api/transaction/stats/category` - Get expense breakdown by category (Authenticated)
- `GET /api/transaction/stats/monthly` - Get monthly income/expense trends (Authenticated)

### Budget Goals (Protected)
- `GET /api/budget` - Get all budget goals with current spending (Authenticated)
- `POST /api/budget` - Create budget goal (Authenticated)
- `PUT /api/budget/:id` - Update budget limit (Authenticated)
- `DELETE /api/budget/:id` - Delete budget goal (Authenticated)

## Features Implemented

✅ **CRUD Operations**: Create, Read, Update, Delete transactions
✅ **Searching**: Search by transaction name or description
✅ **Filtering**: Filter by amount range (min/max), type (income/expense), category
✅ **Sorting**: Sort by date, amount, or name in ascending/descending order
✅ **Pagination**: Navigate through transaction history with page controls
✅ **Authentication**: JWT-based secure authentication
✅ **Role-based Access**: Admin can delete any transaction
✅ **Dashboard Analytics**:
   - Financial overview with 4 key metrics
   - Pie chart for expense breakdown by category
   - Line chart for monthly income/expense trends
   - Recent transactions list
   - Budget goals with progress bars
✅ **Budget Management**: Set spending limits per category and track progress
✅ **Visual Charts**: Interactive charts using Recharts library

## Color Scheme

- Primary: Emerald & Teal gradients
- Income: Green tones
- Expenses: Red tones
- UI: Slate & Gray with accent colors
