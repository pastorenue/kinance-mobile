import { create } from 'zustand';
import { authService } from '../services/auth';
import type { User, Budget, Transaction, Receipt } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  setUser: (user: User | null) => void;
}

interface AppState {
  budgets: Budget[];
  transactions: Transaction[];
  receipts: Receipt[];
  loading: {
    budgets: boolean;
    transactions: boolean;
    receipts: boolean;
  };
  setBudgets: (budgets: Budget[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setReceipts: (receipts: Receipt[]) => void;
  setLoading: (key: keyof AppState['loading'], loading: boolean) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (budget: Budget) => void;
  removeBudget: (budgetId: string) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  removeTransaction: (transactionId: string) => void;
  addReceipt: (receipt: Receipt) => void;
  removeReceipt: (receiptId: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authService.login({ email, password });
      if (response.success) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, firstName: string, lastName: string) => {
    set({ isLoading: true });
    try {
      const response = await authService.register({ email, password, first_name: firstName, last_name: lastName });
      if (response.success) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  checkAuthStatus: async () => {
    set({ isLoading: true });
    try {
      const [isAuthenticated, user] = await Promise.all([
        authService.isAuthenticated(),
        authService.getCurrentUser(),
      ]);
      set({
        isAuthenticated,
        user,
        isLoading: false,
      });
    } catch (error) {
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  },

  setUser: (user: User | null) => {
    set({ user });
  },
}));

export const useAppStore = create<AppState>((set, get) => ({
  budgets: [],
  transactions: [],
  receipts: [],
  loading: {
    budgets: false,
    transactions: false,
    receipts: false,
  },

  setBudgets: (budgets: Budget[]) => {
    set({ budgets });
  },

  setTransactions: (transactions: Transaction[]) => {
    set({ transactions });
  },

  setReceipts: (receipts: Receipt[]) => {
    set({ receipts });
  },

  setLoading: (key: keyof AppState['loading'], loading: boolean) => {
    set((state) => ({
      loading: {
        ...state.loading,
        [key]: loading,
      },
    }));
  },

  addBudget: (budget: Budget) => {
    set((state) => ({
      budgets: [...state.budgets, budget],
    }));
  },

  updateBudget: (updatedBudget: Budget) => {
    set((state) => ({
      budgets: state.budgets.map((budget) =>
        budget.id === updatedBudget.id ? updatedBudget : budget
      ),
    }));
  },

  removeBudget: (budgetId: string) => {
    set((state) => ({
      budgets: state.budgets.filter((budget) => budget.id !== budgetId),
    }));
  },

  addTransaction: (transaction: Transaction) => {
    set((state) => ({
      transactions: [...state.transactions, transaction],
    }));
  },

  updateTransaction: (updatedTransaction: Transaction) => {
    set((state) => ({
      transactions: state.transactions.map((transaction) =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      ),
    }));
  },

  removeTransaction: (transactionId: string) => {
    set((state) => ({
      transactions: state.transactions.filter((transaction) => transaction.id !== transactionId),
    }));
  },

  addReceipt: (receipt: Receipt) => {
    set((state) => ({
      receipts: [...state.receipts, receipt],
    }));
  },

  removeReceipt: (receiptId: string) => {
    set((state) => ({
      receipts: state.receipts.filter((receipt) => receipt.id !== receiptId),
    }));
  },
}));
