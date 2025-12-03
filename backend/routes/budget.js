import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET all budget goals with current spending
router.get('/', authenticateToken, async (req, res) => {
  try {
    const budgets = await prisma.budget.findMany({
      where: { userId: req.user.userId }
    });

    // Calculate current spending for each category
    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        const transactions = await prisma.transaction.findMany({
          where: {
            userId: req.user.userId,
            category: budget.category,
            type: 'expense',
            date: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        });

        const spent = transactions.reduce((sum, t) => sum + t.amount, 0);

        return {
          ...budget,
          spent
        };
      })
    );

    res.json(budgetsWithSpending);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// CREATE budget goal
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { category, limit } = req.body;

    if (!category || !limit) {
      return res.status(400).json({ error: 'Category and limit are required' });
    }

    const budget = await prisma.budget.create({
      data: {
        userId: req.user.userId,
        category,
        limit: parseFloat(limit)
      }
    });

    res.status(201).json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE budget goal
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { limit } = req.body;

    const existing = await prisma.budget.findFirst({
      where: { id: req.params.id, userId: req.user.userId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    const budget = await prisma.budget.update({
      where: { id: req.params.id },
      data: { limit: parseFloat(limit) }
    });

    res.json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE budget goal
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const existing = await prisma.budget.findFirst({
      where: { id: req.params.id, userId: req.user.userId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    await prisma.budget.delete({ where: { id: req.params.id } });

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
