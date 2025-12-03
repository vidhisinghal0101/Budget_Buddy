import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transaction.js';
import budgetRoutes from './routes/budget.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/budget', budgetRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Budget Buddy API' });
});

app.listen(PORT, () => {
  console.log(`Budget Buddy Server running on port ${PORT}`);
});
