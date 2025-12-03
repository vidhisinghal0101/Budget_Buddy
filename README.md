# Budget Buddy 💰

A full-stack personal finance management application to track income, expenses, and manage your budget effectively. Built with React, Node.js, Prisma ORM, and PostgreSQL.

---

## 🌐 Live Demo

- **Frontend**: [https://capstone-sem3-green.vercel.app](https://capstone-sem3-green.vercel.app)
- **Backend API**: [https://capstone-sem3-wjbw.onrender.com](https://capstone-sem3-wjbw.onrender.com)
- **API Health Check**: [https://capstone-sem3-wjbw.onrender.com/api/health](https://capstone-sem3-wjbw.onrender.com/api/health)

> **Note**: Backend is hosted on Render's free tier, so the first request may take ~30 seconds to wake up the server.

---

## � Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Local Setup](#-local-setup)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)

---

## ✨ Features

### Authentication & Security
- 🔐 JWT-based authentication (Login/Signup)
- 🔒 Secure password hashing with bcrypt
- 👤 Role-based access control (Admin/User)

### Transaction Management
- 💳 Full CRUD operations for transactions
- 🔍 Search by transaction name or description
- 🎯 Filter by amount range, type (income/expense), and category
- 📊 Sort by date, amount, or name (ascending/descending)
- 📄 Pagination for transaction history
- 📝 Categories: Food, Transport, Bills, Shopping, Entertainment, Healthcare, Other

### Budget Management
- 💰 Set monthly spending limits per category
- 📈 Track spending progress with visual progress bars
- ⚠️ Color-coded warnings (Green < 70%, Orange 70-90%, Red > 90%)
- 🎯 Budget vs actual spending comparison

### Dashboard Analytics
- 📊 Financial overview with 4 key metrics:
  - Total Income
  - Total Expenses
  - Current Balance
  - Estimated In-Hand Salary
- 🥧 Pie chart for expense breakdown by category
- 📈 Line chart for monthly income/expense trends (last 6 months)
- 📋 Recent transactions widget
- 🎯 Budget goals with progress tracking

### UI/UX
- 🎨 Clean, modern UI with Tailwind CSS
- 📱 Fully responsive design
- 🌈 Color scheme: Emerald & Teal gradients (no purple!)
- ⚡ Fast and smooth animations
- 📊 Interactive charts using Recharts library

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Build Tool**: Vite
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Deployment**: Render

---

## 📁 Project Structure

```
Capstone_Sem3/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── prisma/
│   │   └── schema.prisma        # Database schema
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── transaction.js       # Transaction CRUD & stats
│   │   └── budget.js            # Budget goals management
│   ├── .env                     # Environment variables
│   ├── .env.example             # Environment template
│   ├── server.js                # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── config/
│   │   │   └── api.js           # API URL configuration
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Signup.jsx       # Signup page
│   │   │   ├── Dashboard.jsx    # Dashboard with analytics
│   │   │   ├── Transactions.jsx # Transaction management
│   │   │   └── Budget.jsx       # Budget goals page
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── .env.example             # Environment template
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (or Neon account)

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/vidhisinghal0101/Capstone_Sem3.git
cd Capstone_Sem3/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT=4000
NODE_ENV=development
```

4. **Set up database**
```bash
npx prisma generate
npx prisma db push
```

5. **Start the server**
```bash
npm run dev
```

Backend will run on `http://localhost:4000`

### Frontend Setup

1. **Navigate to frontend folder**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:4000
```

4. **Start the development server**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## 📚 API Documentation

### Base URL
- **Local**: `http://localhost:4000`
- **Production**: `https://capstone-sem3-wjbw.onrender.com`

### Authentication Endpoints

#### Register User
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Transaction Endpoints (Protected)

All transaction endpoints require JWT token in Authorization header:
```http
Authorization: Bearer <your-jwt-token>
```

#### Get All Transactions
```http
GET /api/transaction?page=1&limit=10&sortBy=date&order=desc&search=food&minAmount=100&maxAmount=5000&type=expense&category=Food
```

#### Create Transaction
```http
POST /api/transaction
Content-Type: application/json

{
  "name": "Grocery Shopping",
  "amount": 2500,
  "type": "expense",
  "category": "Food",
  "description": "Weekly groceries"
}
```

#### Update Transaction
```http
PUT /api/transaction/:id
Content-Type: application/json

{
  "name": "Updated name",
  "amount": 3000
}
```

#### Delete Transaction
```http
DELETE /api/transaction/:id
```

#### Get Statistics
```http
GET /api/transaction/stats/summary
GET /api/transaction/stats/category
GET /api/transaction/stats/monthly
```

### Budget Endpoints (Protected)

#### Get All Budgets
```http
GET /api/budget
```

#### Create Budget Goal
```http
POST /api/budget
Content-Type: application/json

{
  "category": "Food",
  "limit": 8000
}
```

#### Update Budget
```http
PUT /api/budget/:id
Content-Type: application/json

{
  "limit": 10000
}
```

#### Delete Budget
```http
DELETE /api/budget/:id
```

---

## 🌍 Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `node server.js`
4. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PORT=4000`
   - `NODE_ENV=production`

### Frontend (Vercel)

1. Import your GitHub repository to Vercel
2. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add environment variable:
   - `VITE_API_URL=https://your-backend-url.onrender.com`

---

## 📸 Screenshots

### Login Page
Clean and modern login interface with gradient design.

### Dashboard
Comprehensive financial overview with charts and statistics.

### Transactions
Full transaction management with search, filter, sort, and pagination.

### Budget Goals
Visual budget tracking with progress bars and warnings.

---

## 🎯 Key Features Implemented

✅ **CRUD Operations**: Complete Create, Read, Update, Delete for transactions  
✅ **Searching**: Real-time search by transaction name or description  
✅ **Filtering**: Multiple filters (amount range, type, category)  
✅ **Sorting**: Sort by date, amount, or name (asc/desc)  
✅ **Pagination**: Navigate through large transaction lists  
✅ **Authentication**: Secure JWT-based auth system  
✅ **Role-based Access**: Admin privileges for certain operations  
✅ **Dashboard Analytics**: Visual charts and financial insights  
✅ **Budget Management**: Set and track spending limits  
✅ **Responsive Design**: Works on desktop, tablet, and mobile  

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 👨‍💻 Author

**Vidhi Singhal**
- GitHub: [@vidhisinghal0101](https://github.com/vidhisinghal0101)

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- Built as part of Capstone Project Semester 3
- Neon for PostgreSQL database hosting
- Vercel for frontend hosting
- Render for backend hosting

---

**Made with ❤️ using React, Node.js, and Prisma**
