import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();
const prisma = new PrismaClient();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, pin } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!pin || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ error: 'A 4-digit PIN is required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPin = await bcrypt.hash(pin, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, pin: hashedPin }
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// POST /api/auth/verify-user
// Step 1: check if username (email) exists
router.post('/verify-user', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    res.json({ message: 'User found' });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/verify-pin
// Step 2: verify the 4-digit PIN
router.post('/verify-pin', async (req, res) => {
  try {
    const { email, pin } = req.body;
    if (!email || !pin) {
      return res.status(400).json({ error: 'Email and PIN are required' });
    }

    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({ error: 'PIN must be exactly 4 digits' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    if (!user.pin) {
      return res.status(400).json({ error: 'No PIN set for this account' });
    }

    const isValidPin = await bcrypt.compare(pin, user.pin);
    if (!isValidPin) {
      return res.status(401).json({ error: 'Incorrect PIN' });
    }

    res.json({ message: 'PIN verified' });
  } catch (error) {
    console.error('Verify PIN error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/reset-password-pin
// Step 3: reset password after PIN verified
router.post('/reset-password-pin', async (req, res) => {
  try {
    const { email, pin, newPassword } = req.body;

    if (!email || !pin || !newPassword) {
      return res.status(400).json({ error: 'Email, PIN, and new password are required' });
    }

    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({ error: 'PIN must be exactly 4 digits' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    if (!user.pin) {
      return res.status(400).json({ error: 'No PIN set for this account' });
    }

    // Re-verify PIN on final step to prevent bypass
    const isValidPin = await bcrypt.compare(pin, user.pin);
    if (!isValidPin) {
      return res.status(401).json({ error: 'Incorrect PIN' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/auth/delete-account
// Permanently delete account — requires password confirmation

router.delete('/delete-account', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Password is required to delete your account' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Cascade deletes transactions and budgets via Prisma schema relations
    await prisma.user.delete({ where: { id: user.id } });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
