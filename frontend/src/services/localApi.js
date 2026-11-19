// Local Storage Mock API Layer
// Replaces external database & backend auth with self-contained, responsive browser storage.

const STORAGE_KEYS = {
  TRANSACTIONS: 'bb_transactions_v2',
  BUDGETS: 'bb_budgets_v2',
  SAVINGS: 'bb_savings_v2',
  USER: 'user',
  TOKEN: 'token'
};

const CATEGORY_COLORS = {
  Food: '#10b981',
  Transport: '#3b82f6',
  Bills: '#ef4444',
  Shopping: '#f59e0b',
  Entertainment: '#8b5cf6',
  Healthcare: '#ec4899',
  Other: '#6b7280'
};

const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    userId: 'guest',
    name: 'Tech Corp Salary',
    amount: 55000,
    type: 'income',
    category: 'Salary',
    description: 'Monthly direct deposit salary',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tx-2',
    userId: 'guest',
    name: 'Freelance Design',
    amount: 15000,
    type: 'income',
    category: 'Freelance',
    description: 'Landing page design milestone',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tx-3',
    userId: 'guest',
    name: 'Whole Foods Market',
    amount: 4200,
    type: 'expense',
    category: 'Food',
    description: 'Weekly organic groceries & pantry refill',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tx-4',
    userId: 'guest',
    name: 'Electricity & Utilities',
    amount: 2850,
    type: 'expense',
    category: 'Bills',
    description: 'Monthly apartment utility bill',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tx-5',
    userId: 'guest',
    name: 'Metro Pass & Uber',
    amount: 1650,
    type: 'expense',
    category: 'Transport',
    description: 'Weekly travel pass and rides',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tx-6',
    userId: 'guest',
    name: 'Zara Apparel',
    amount: 3500,
    type: 'expense',
    category: 'Shopping',
    description: 'Casual jacket and accessories',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tx-7',
    userId: 'guest',
    name: 'Streaming Subscriptions',
    amount: 899,
    type: 'expense',
    category: 'Entertainment',
    description: 'Netflix and Spotify premium',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tx-8',
    userId: 'guest',
    name: 'Pharmacy & Health',
    amount: 1200,
    type: 'expense',
    category: 'Healthcare',
    description: 'Vitamins and routine prescriptions',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tx-9',
    userId: 'guest',
    name: 'Bistro Dinner',
    amount: 1950,
    type: 'expense',
    category: 'Food',
    description: 'Weekend dinner with friends',
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tx-10',
    userId: 'guest',
    name: 'High-Speed Fiber Internet',
    amount: 1199,
    type: 'expense',
    category: 'Bills',
    description: 'Unlimited 300 Mbps broadband',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_BUDGETS = [
  { id: 'b-1', category: 'Food', limit: 8000 },
  { id: 'b-2', category: 'Transport', limit: 4000 },
  { id: 'b-3', category: 'Bills', limit: 6000 },
  { id: 'b-4', category: 'Shopping', limit: 6000 },
  { id: 'b-5', category: 'Entertainment', limit: 3000 },
  { id: 'b-6', category: 'Healthcare', limit: 4000 }
];

const INITIAL_SAVINGS = [
  {
    id: 'vault-1',
    name: 'Emergency Fund',
    targetAmount: 100000,
    currentAmount: 65000,
    color: 'primary',
    targetDate: '2026-12-31',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'vault-2',
    name: 'Dream Vacation',
    targetAmount: 50000,
    currentAmount: 32000,
    color: 'emerald',
    targetDate: '2026-08-15',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'vault-3',
    name: 'New Workstation',
    targetAmount: 85000,
    currentAmount: 52000,
    color: 'blue',
    targetDate: '2026-05-30',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Initialize storage safely
export function initLocalStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.TOKEN)) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, 'local-guest-token');
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(
      STORAGE_KEYS.USER,
      JSON.stringify({ id: 'guest', name: '', email: 'guest@budgetbuddy.app', salary: 50000 })
    );
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BUDGETS)) {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(INITIAL_BUDGETS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SAVINGS)) {
    localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(INITIAL_SAVINGS));
  }
}

// Data access helpers
function getTransactions() {
  initLocalStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) || [];
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

function saveTransactions(data) {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(data));
}

function getBudgets() {
  initLocalStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BUDGETS)) || [];
  } catch {
    return INITIAL_BUDGETS;
  }
}

function saveBudgets(data) {
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(data));
}

function getSavings() {
  initLocalStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVINGS)) || [];
  } catch {
    return INITIAL_SAVINGS;
  }
}

function saveSavings(data) {
  localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(data));
}

function createJsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Mock API request router
export async function handleLocalApiRequest(urlStr, init = {}) {
  initLocalStorage();
  const method = (init.method || 'GET').toUpperCase();
  let body = {};
  if (init.body) {
    try {
      body = typeof init.body === 'string' ? JSON.parse(init.body) : init.body;
    } catch {
      body = {};
    }
  }

  // Normalize path by stripping host if present
  let urlObj;
  try {
    urlObj = new URL(urlStr, window.location.origin);
  } catch {
    urlObj = new URL(`http://localhost${urlStr.startsWith('/') ? '' : '/'}${urlStr}`);
  }
  const pathname = urlObj.pathname;
  const searchParams = urlObj.searchParams;

  // 1. Transaction Summary Stats
  if (pathname === '/api/transaction/stats/summary') {
    const transactions = getTransactions();
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const salary = 50000;
    return createJsonResponse({
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      salary,
      estimatedInHand: salary + income - expenses,
      transactionCount: transactions.length,
      incomeCount: transactions.filter((t) => t.type === 'income').length,
      expenseCount: transactions.filter((t) => t.type === 'expense').length
    });
  }

  // 2. Transaction Category Breakdown
  if (pathname === '/api/transaction/stats/category') {
    const transactions = getTransactions();
    const expenseTx = transactions.filter((t) => t.type === 'expense');
    const categoryMap = {};
    expenseTx.forEach((t) => {
      const cat = t.category || 'Other';
      categoryMap[cat] = (categoryMap[cat] || 0) + Number(t.amount || 0);
    });

    const data = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || '#6b7280'
    }));
    return createJsonResponse(data);
  }

  // 3. Transaction Monthly Trends
  if (pathname === '/api/transaction/stats/monthly') {
    const transactions = getTransactions();
    const monthlyMap = {};

    // Seed baseline last 6 months so charts look complete
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      monthlyMap[key] = {
        income: Math.round(48000 + ((i * 3700) % 12000)),
        expense: Math.round(22000 + ((i * 2900) % 8000))
      };
    }

    // Incorporate current transactions
    transactions.forEach((t) => {
      const d = new Date(t.date || t.createdAt);
      if (!isNaN(d.getTime())) {
        const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        if (!monthlyMap[key]) {
          monthlyMap[key] = { income: 0, expense: 0 };
        }
        if (t.type === 'income') {
          monthlyMap[key].income += Number(t.amount || 0);
        } else {
          monthlyMap[key].expense += Number(t.amount || 0);
        }
      }
    });

    const data = Object.entries(monthlyMap)
      .map(([month, vals]) => ({
        month,
        income: vals.income,
        expense: vals.expense
      }))
      .slice(-6);

    return createJsonResponse(data);
  }

  // 4. Transaction CRUD
  if (pathname === '/api/transaction') {
    if (method === 'GET') {
      let list = [...getTransactions()];
      const search = searchParams.get('search');
      const minAmount = searchParams.get('minAmount');
      const maxAmount = searchParams.get('maxAmount');
      const type = searchParams.get('type');
      const category = searchParams.get('category');
      const sortBy = searchParams.get('sortBy') || 'date';
      const order = searchParams.get('order') || 'desc';
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = parseInt(searchParams.get('limit') || '10', 10);

      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          (t) =>
            (t.name && t.name.toLowerCase().includes(q)) ||
            (t.description && t.description.toLowerCase().includes(q))
        );
      }
      if (minAmount) {
        list = list.filter((t) => Number(t.amount) >= parseFloat(minAmount));
      }
      if (maxAmount) {
        list = list.filter((t) => Number(t.amount) <= parseFloat(maxAmount));
      }
      if (type) {
        list = list.filter((t) => t.type === type);
      }
      if (category) {
        list = list.filter((t) => t.category === category);
      }

      list.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        if (sortBy === 'date') {
          valA = new Date(valA || a.createdAt).getTime();
          valB = new Date(valB || b.createdAt).getTime();
        } else if (sortBy === 'amount') {
          valA = Number(valA || 0);
          valB = Number(valB || 0);
        }
        if (order === 'asc') return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });

      const total = list.length;
      const skip = (page - 1) * limit;
      const paginated = list.slice(skip, skip + limit);

      return createJsonResponse({
        transactions: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      });
    }

    if (method === 'POST') {
      const list = getTransactions();
      const newTx = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId: 'guest',
        name: body.name || 'Untitled Transaction',
        amount: parseFloat(body.amount) || 0,
        type: body.type || 'expense',
        category: body.category || 'Other',
        description: body.description || '',
        date: body.date || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };
      list.unshift(newTx);
      saveTransactions(list);
      return createJsonResponse(newTx, 201);
    }
  }

  // 5. Single Transaction PUT / DELETE
  const txMatch = pathname.match(/^\/api\/transaction\/([a-zA-Z0-9_-]+)$/);
  if (txMatch) {
    const id = txMatch[1];
    const list = getTransactions();
    const index = list.findIndex((t) => t.id === id);

    if (method === 'GET') {
      if (index === -1) return createJsonResponse({ error: 'Transaction not found' }, 404);
      return createJsonResponse(list[index]);
    }

    if (method === 'PUT') {
      if (index === -1) return createJsonResponse({ error: 'Transaction not found' }, 404);
      list[index] = {
        ...list[index],
        name: body.name !== undefined ? body.name : list[index].name,
        amount: body.amount !== undefined ? parseFloat(body.amount) : list[index].amount,
        type: body.type !== undefined ? body.type : list[index].type,
        category: body.category !== undefined ? body.category : list[index].category,
        description: body.description !== undefined ? body.description : list[index].description,
        date: body.date !== undefined ? body.date : list[index].date
      };
      saveTransactions(list);
      return createJsonResponse(list[index]);
    }

    if (method === 'DELETE') {
      const filtered = list.filter((t) => t.id !== id);
      saveTransactions(filtered);
      return createJsonResponse({ message: 'Transaction deleted successfully' });
    }
  }

  // 6. Budgets CRUD
  if (pathname === '/api/budget') {
    if (method === 'GET') {
      const budgets = getBudgets();
      const transactions = getTransactions();
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const budgetsWithSpending = budgets.map((b) => {
        const spent = transactions
          .filter((t) => {
            if (t.type !== 'expense' || t.category !== b.category) return false;
            const d = new Date(t.date || t.createdAt);
            return d >= monthStart;
          })
          .reduce((sum, t) => sum + Number(t.amount || 0), 0);

        return {
          ...b,
          spent
        };
      });

      return createJsonResponse(budgetsWithSpending);
    }

    if (method === 'POST') {
      const list = getBudgets();
      const newBudget = {
        id: `b-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId: 'guest',
        category: body.category || 'Other',
        limit: parseFloat(body.limit) || 0,
        spent: 0
      };
      list.push(newBudget);
      saveBudgets(list);
      return createJsonResponse(newBudget, 201);
    }
  }

  const budgetMatch = pathname.match(/^\/api\/budget\/([a-zA-Z0-9_-]+)$/);
  if (budgetMatch) {
    const id = budgetMatch[1];
    const list = getBudgets();
    const index = list.findIndex((b) => b.id === id);

    if (method === 'PUT') {
      if (index === -1) return createJsonResponse({ error: 'Budget not found' }, 404);
      list[index].limit = parseFloat(body.limit) || list[index].limit;
      saveBudgets(list);
      return createJsonResponse(list[index]);
    }

    if (method === 'DELETE') {
      const filtered = list.filter((b) => b.id !== id);
      saveBudgets(filtered);
      return createJsonResponse({ message: 'Budget deleted successfully' });
    }
  }

  // 7. Savings Vaults CRUD
  if (pathname === '/api/savings') {
    if (method === 'GET') {
      return createJsonResponse(getSavings());
    }

    if (method === 'POST') {
      const list = getSavings();
      const newVault = {
        id: `vault-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId: 'guest',
        name: body.name || 'Untitled Vault',
        targetAmount: parseFloat(body.targetAmount) || 0,
        currentAmount: parseFloat(body.currentAmount) || 0,
        color: body.color || 'primary',
        targetDate: body.targetDate || null,
        createdAt: new Date().toISOString()
      };
      list.unshift(newVault);
      saveSavings(list);
      return createJsonResponse(newVault, 201);
    }
  }

  const savingsMatch = pathname.match(/^\/api\/savings\/([a-zA-Z0-9_-]+)$/);
  if (savingsMatch) {
    const id = savingsMatch[1];
    const list = getSavings();
    const index = list.findIndex((s) => s.id === id);

    if (method === 'PUT') {
      if (index === -1) return createJsonResponse({ error: 'Vault not found' }, 404);
      list[index] = {
        ...list[index],
        name: body.name !== undefined ? body.name : list[index].name,
        targetAmount: body.targetAmount !== undefined ? parseFloat(body.targetAmount) : list[index].targetAmount,
        currentAmount: body.currentAmount !== undefined ? parseFloat(body.currentAmount) : list[index].currentAmount,
        color: body.color !== undefined ? body.color : list[index].color,
        targetDate: body.targetDate !== undefined ? body.targetDate : list[index].targetDate
      };
      saveSavings(list);
      return createJsonResponse(list[index]);
    }

    if (method === 'DELETE') {
      const filtered = list.filter((s) => s.id !== id);
      saveSavings(filtered);
      return createJsonResponse({ message: 'Vault deleted successfully' });
    }
  }

  // 8. Auth bypass endpoints
  if (pathname === '/api/auth/profile') {
    return createJsonResponse({
      id: 'guest',
      name: '',
      email: 'guest@budgetbuddy.app',
      salary: 50000
    });
  }

  if (pathname === '/api/auth/login' || pathname === '/api/auth/signup') {
    return createJsonResponse({
      token: 'local-guest-token',
      user: { id: 'guest', name: '', email: 'guest@budgetbuddy.app' }
    });
  }

  if (pathname === '/api/auth/delete-account') {
    return createJsonResponse({ message: 'Account cleared' });
  }

  // Fallback
  return createJsonResponse({ status: 'ok', fallback: true });
}

// Global fetch interceptor
if (typeof window !== 'undefined') {
  initLocalStorage();
  const originalFetch = window.fetch;
  window.fetch = async function (input, init) {
    const url = typeof input === 'string' ? input : input?.url || '';
    if (url.includes('/api/')) {
      try {
        return await handleLocalApiRequest(url, init);
      } catch (err) {
        console.warn('Local API error:', err);
        return createJsonResponse({ error: err.message }, 500);
      }
    }
    return originalFetch.apply(this, arguments);
  };
}
