import { PrismaClient } from '@prisma/client';

// In-memory fallback database for when database connection is down or offline
const memoryStore = {
  users: [
    {
      id: 'guest',
      name: '',
      email: 'guest@budgetbuddy.app',
      role: 'user',
      salary: 50000,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  transactions: [
    {
      id: 'tx-1',
      userId: 'guest',
      name: 'Tech Corp Salary',
      amount: 55000,
      type: 'income',
      category: 'Salary',
      description: 'Monthly direct deposit salary',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    },
    {
      id: 'tx-2',
      userId: 'guest',
      name: 'Freelance Design',
      amount: 15000,
      type: 'income',
      category: 'Freelance',
      description: 'Landing page design milestone',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    },
    {
      id: 'tx-3',
      userId: 'guest',
      name: 'Whole Foods Market',
      amount: 4200,
      type: 'expense',
      category: 'Food',
      description: 'Weekly organic groceries & pantry refill',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    },
    {
      id: 'tx-4',
      userId: 'guest',
      name: 'Electricity & Utilities',
      amount: 2850,
      type: 'expense',
      category: 'Bills',
      description: 'Monthly apartment utility bill',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    },
    {
      id: 'tx-5',
      userId: 'guest',
      name: 'Metro Pass & Uber',
      amount: 1650,
      type: 'expense',
      category: 'Transport',
      description: 'Weekly travel pass and rides',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    },
    {
      id: 'tx-6',
      userId: 'guest',
      name: 'Zara Apparel',
      amount: 3500,
      type: 'expense',
      category: 'Shopping',
      description: 'Casual jacket and accessories',
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    },
    {
      id: 'tx-7',
      userId: 'guest',
      name: 'Streaming Subscriptions',
      amount: 899,
      type: 'expense',
      category: 'Entertainment',
      description: 'Netflix and Spotify premium',
      date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    },
    {
      id: 'tx-8',
      userId: 'guest',
      name: 'Pharmacy & Health',
      amount: 1200,
      type: 'expense',
      category: 'Healthcare',
      description: 'Vitamins and routine prescriptions',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    }
  ],
  budgets: [
    { id: 'b-1', userId: 'guest', category: 'Food', limit: 8000 },
    { id: 'b-2', userId: 'guest', category: 'Transport', limit: 4000 },
    { id: 'b-3', userId: 'guest', category: 'Bills', limit: 6000 },
    { id: 'b-4', userId: 'guest', category: 'Shopping', limit: 6000 },
    { id: 'b-5', userId: 'guest', category: 'Entertainment', limit: 3000 },
    { id: 'b-6', userId: 'guest', category: 'Healthcare', limit: 4000 }
  ],
  savings: [
    {
      id: 'vault-1',
      userId: 'guest',
      name: 'Emergency Fund',
      targetAmount: 100000,
      currentAmount: 65000,
      color: 'primary',
      targetDate: new Date('2026-12-31'),
      createdAt: new Date()
    },
    {
      id: 'vault-2',
      userId: 'guest',
      name: 'Dream Vacation',
      targetAmount: 50000,
      currentAmount: 32000,
      color: 'emerald',
      targetDate: new Date('2026-08-15'),
      createdAt: new Date()
    },
    {
      id: 'vault-3',
      userId: 'guest',
      name: 'New Workstation',
      targetAmount: 85000,
      currentAmount: 52000,
      color: 'blue',
      targetDate: new Date('2026-05-30'),
      createdAt: new Date()
    }
  ]
};

const mockPrisma = {
  user: {
    findUnique: async ({ where } = {}) => {
      if (!where) return memoryStore.users[0];
      return (
        memoryStore.users.find(
          (u) => (where.id && u.id === where.id) || (where.email && u.email === where.email)
        ) || memoryStore.users[0]
      );
    },
    findFirst: async ({ where } = {}) => {
      if (!where) return memoryStore.users[0];
      return (
        memoryStore.users.find(
          (u) => (where.id && u.id === where.id) || (where.email && u.email === where.email)
        ) || memoryStore.users[0]
      );
    },
    create: async ({ data } = {}) => {
      const newUser = { id: `user-${Date.now()}`, ...(data || {}), createdAt: new Date() };
      memoryStore.users.push(newUser);
      return newUser;
    },
    update: async ({ where, data } = {}) => {
      const user = memoryStore.users.find((u) => where && u.id === where.id) || memoryStore.users[0];
      if (data) Object.assign(user, data);
      return user;
    },
    delete: async () => ({ message: 'User deleted' })
  },
  transaction: {
    findMany: async (args = {}) => {
      let list = [...memoryStore.transactions];
      const { where, orderBy, skip = 0, take } = args;
      if (where) {
        if (where.type) list = list.filter((t) => t.type === where.type);
        if (where.category) list = list.filter((t) => t.category === where.category);
        if (where.date && where.date.gte) {
          list = list.filter((t) => new Date(t.date) >= new Date(where.date.gte));
        }
      }
      if (orderBy) {
        const key = Object.keys(orderBy)[0];
        const dir = orderBy[key];
        list.sort((a, b) => {
          let va = a[key];
          let vb = b[key];
          if (key === 'date') {
            va = new Date(va).getTime();
            vb = new Date(vb).getTime();
          }
          return dir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
        });
      }
      if (take !== undefined) {
        list = list.slice(skip, skip + take);
      }
      return list;
    },
    count: async (args = {}) => {
      let list = memoryStore.transactions;
      if (args.where) {
        if (args.where.type) list = list.filter((t) => t.type === args.where.type);
        if (args.where.category) list = list.filter((t) => t.category === args.where.category);
      }
      return list.length;
    },
    findFirst: async ({ where } = {}) => {
      if (!where) return memoryStore.transactions[0] || null;
      return memoryStore.transactions.find((t) => t.id === where.id) || null;
    },
    create: async ({ data } = {}) => {
      const newTx = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        ...(data || {}),
        createdAt: new Date()
      };
      memoryStore.transactions.unshift(newTx);
      return newTx;
    },
    update: async ({ where, data } = {}) => {
      const tx = memoryStore.transactions.find((t) => where && t.id === where.id);
      if (!tx) throw new Error('Transaction not found');
      if (data) Object.assign(tx, data);
      return tx;
    },
    delete: async ({ where } = {}) => {
      const idx = memoryStore.transactions.findIndex((t) => where && t.id === where.id);
      if (idx !== -1) memoryStore.transactions.splice(idx, 1);
      return { message: 'Deleted' };
    }
  },
  budget: {
    findMany: async () => [...memoryStore.budgets],
    findFirst: async ({ where } = {}) => {
      if (!where) return memoryStore.budgets[0] || null;
      return memoryStore.budgets.find((b) => b.id === where.id) || null;
    },
    create: async ({ data } = {}) => {
      const newB = { id: `b-${Date.now()}`, ...(data || {}) };
      memoryStore.budgets.push(newB);
      return newB;
    },
    update: async ({ where, data } = {}) => {
      const b = memoryStore.budgets.find((item) => where && item.id === where.id);
      if (!b) throw new Error('Budget not found');
      if (data) Object.assign(b, data);
      return b;
    },
    delete: async ({ where } = {}) => {
      const idx = memoryStore.budgets.findIndex((b) => where && b.id === where.id);
      if (idx !== -1) memoryStore.budgets.splice(idx, 1);
      return { message: 'Deleted' };
    }
  },
  savingsGoal: {
    findMany: async () => [...memoryStore.savings],
    findUnique: async ({ where } = {}) => {
      if (!where) return memoryStore.savings[0] || null;
      return memoryStore.savings.find((s) => s.id === where.id) || null;
    },
    findFirst: async ({ where } = {}) => {
      if (!where) return memoryStore.savings[0] || null;
      return memoryStore.savings.find((s) => s.id === where.id) || null;
    },
    create: async ({ data } = {}) => {
      const newS = { id: `vault-${Date.now()}`, ...(data || {}), createdAt: new Date() };
      memoryStore.savings.unshift(newS);
      return newS;
    },
    update: async ({ where, data } = {}) => {
      const s = memoryStore.savings.find((item) => where && item.id === where.id);
      if (!s) throw new Error('Savings goal not found');
      if (data) Object.assign(s, data);
      return s;
    },
    delete: async ({ where } = {}) => {
      const idx = memoryStore.savings.findIndex((s) => where && s.id === where.id);
      if (idx !== -1) memoryStore.savings.splice(idx, 1);
      return { message: 'Deleted' };
    }
  },
  $disconnect: async () => {}
};

// Create a safe client that wraps real Prisma and falls back to in-memory store if DB is down
let realPrisma = null;
try {
  realPrisma = new PrismaClient();
} catch (e) {
  console.warn('⚠️ PrismaClient failed to instantiate, using in-memory store:', e.message);
}

// Proxy wrapper around models
function createSafeModel(modelName) {
  return new Proxy(mockPrisma[modelName], {
    get(target, prop) {
      return async (...args) => {
        if (realPrisma && realPrisma[modelName] && typeof realPrisma[modelName][prop] === 'function') {
          try {
            return await realPrisma[modelName][prop](...args);
          } catch (dbErr) {
            // DB connection or query failed -> fall back cleanly to mockPrisma
            return target[prop](...args);
          }
        }
        return target[prop](...args);
      };
    }
  });
}

export const prisma = {
  user: createSafeModel('user'),
  transaction: createSafeModel('transaction'),
  budget: createSafeModel('budget'),
  savingsGoal: createSafeModel('savingsGoal'),
  $disconnect: async () => {
    if (realPrisma) {
      try {
        await realPrisma.$disconnect();
      } catch {}
    }
  }
};
