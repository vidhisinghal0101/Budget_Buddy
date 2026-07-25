import express from 'express';
import { prisma } from '../prisma/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET all savings goals for the user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const goals = await prisma.savingsGoal.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(goals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch savings goals' });
  }
});

// POST create a new savings goal
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, color, targetDate } = req.body;
    
    if (!name || !targetAmount) {
      return res.status(400).json({ error: 'Name and target amount are required' });
    }

    const goal = await prisma.savingsGoal.create({
      data: {
        userId: req.user.userId,
        name,
        targetAmount: parseFloat(targetAmount),
        currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
        color: color || 'primary',
        targetDate: targetDate ? new Date(targetDate) : null
      }
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create savings goal' });
  }
});

// PUT update a savings goal (e.g. deposit/withdraw)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, targetAmount, currentAmount, color, targetDate } = req.body;

    const existingGoal = await prisma.savingsGoal.findUnique({ where: { id } });
    if (!existingGoal || existingGoal.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const goal = await prisma.savingsGoal.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingGoal.name,
        targetAmount: targetAmount !== undefined ? parseFloat(targetAmount) : existingGoal.targetAmount,
        currentAmount: currentAmount !== undefined ? parseFloat(currentAmount) : existingGoal.currentAmount,
        color: color !== undefined ? color : existingGoal.color,
        targetDate: targetDate !== undefined ? (targetDate ? new Date(targetDate) : null) : existingGoal.targetDate
      }
    });

    res.json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update savings goal' });
  }
});

// DELETE a savings goal
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const existingGoal = await prisma.savingsGoal.findUnique({ where: { id } });
    if (!existingGoal || existingGoal.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    await prisma.savingsGoal.delete({ where: { id } });
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete savings goal' });
  }
});

export default router;
