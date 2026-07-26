import dotenv from 'dotenv';
dotenv.config({ override: true });

// Global catch-all for unhandled promises and exceptions (Prevents Node.js from crashing)
process.on('uncaughtException', (err) => {
  console.error('🔥 UNCAUGHT EXCEPTION: Node process would have crashed. Error:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 UNHANDLED REJECTION: Node process would have crashed. Reason:', reason);
});
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transaction.js';
import budgetRoutes from './routes/budget.js';
import savingsRoutes from './routes/savings.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Serve static frontend assets (built files from ../frontend/dist)
const frontendDist = path.resolve(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));

app.use('/api/auth', authRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/savings', savingsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Budget Buddy API' });
});

// Fallback: serve index.html for any unknown route (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('🔥 EXPRESS ERROR:', err.stack || err.message || err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went critically wrong'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Budget Buddy Server running on port ${PORT}`);
});

// Force restart to apply Neon DB connection
