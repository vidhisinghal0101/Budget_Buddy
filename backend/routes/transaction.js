import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET all transactions with search, filter, sort, pagination
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      search, 
      minAmount, 
      maxAmount, 
      type, 
      category,
      sortBy = 'date', 
      order = 'desc',
      page = 1,
      limit = 10 
    } = req.query;

    const where = { userId: req.user.userId };

    // Search by name or description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Filter by amount range
    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) where.amount.gte = parseFloat(minAmount);
      if (maxAmount) where.amount.lte = parseFloat(maxAmount);
    }

    // Filter by type
    if (type) where.type = type;

    // Filter by category
    if (category) where.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orderBy = { [sortBy]: order };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit)
      }),
      prisma.transaction.count({ where })
    ]);

    res.json({
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single transaction
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: { id: req.params.id, userId: req.user.userId }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// CREATE transaction
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, amount, type, category, description, date } = req.body;

    if (!name || !amount || !type || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: req.user.userId,
        name,
        amount: parseFloat(amount),
        type,
        category,
        description,
        date: date ? new Date(date) : new Date()
      }
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE transaction
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, amount, type, category, description, date } = req.body;

    const existing = await prisma.transaction.findFirst({
      where: { id: req.params.id, userId: req.user.userId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const transaction = await prisma.transaction.update({
      where: { id: req.params.id },
      data: {
        name,
        amount: amount ? parseFloat(amount) : undefined,
        type,
        category,
        description,
        date: date ? new Date(date) : undefined
      }
    });

    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE transaction
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const existing = await prisma.transaction.findFirst({
      where: { id: req.params.id, userId: req.user.userId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Check if user is admin or owner
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (user.role !== 'admin' && existing.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.transaction.delete({ where: { id: req.params.id } });

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET statistics
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.userId }
    });

    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const expenseTransactions = transactions.filter(t => t.type === 'expense');

    const income = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const expenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });

    res.json({
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      salary: user.salary || 0,
      estimatedInHand: (user.salary || 0) + income - expenses,
      transactionCount: transactions.length,
      incomeCount: incomeTransactions.length,
      expenseCount: expenseTransactions.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET category breakdown
router.get('/stats/category', authenticateToken, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.userId, type: 'expense' }
    });

    const categoryMap = {};
    transactions.forEach(t => {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = 0;
      }
      categoryMap[t.category] += t.amount;
    });

    const colors = {
      Food: '#10b981',
      Transport: '#3b82f6',
      Bills: '#ef4444',
      Shopping: '#f59e0b',
      Entertainment: '#8b5cf6',
      Healthcare: '#ec4899',
      Other: '#6b7280'
    };

    const data = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || '#6b7280'
    }));

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET monthly trends
router.get('/stats/monthly', authenticateToken, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.userId }
    });

    const monthlyMap = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!monthlyMap[month]) {
        monthlyMap[month] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        monthlyMap[month].income += t.amount;
      } else {
        monthlyMap[month].expense += t.amount;
      }
    });

    const data = Object.entries(monthlyMap)
      .map(([month, values]) => ({
        month,
        income: values.income,
        expense: values.expense
      }))
      .slice(-6); // Last 6 months

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
