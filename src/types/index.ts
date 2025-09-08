// User types
export interface User {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string | null;
  profile_picture: string;
  is_active: boolean;
  family_id: string | null;
  role: string;
  address: any | null;
  groups: any | null;
  is_super_admin: boolean;
  is_staff: boolean;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

// Budget types
export interface Budget {
  id: string;
  name: string;
  description?: string;
  amount: number;
  spent: number;
  currency: string;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
  endDate: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetRequest {
  name: string;
  description?: string;
  amount: number;
  currency: string;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
  endDate: string;
}

// Transaction types
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  currency: string;
  category: string;
  type: 'income' | 'expense';
  date: string;
  budgetId?: string;
  receiptId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  description: string;
  amount: number;
  currency: string;
  category: string;
  type: 'income' | 'expense';
  date: string;
  budgetId?: string;
}

// Receipt types
export interface Receipt {
  id: string;
  filename: string;
  url: string;
  processedData?: {
    amount?: number;
    date?: string;
    merchant?: string;
    items?: Array<{
      name: string;
      price: number;
      quantity: number;
    }>;
  };
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Navigation types
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Splash: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Budgets: undefined;
  Transactions: undefined;
  Receipts: undefined;
  Profile: undefined;
};

export type BudgetStackParamList = {
  BudgetList: undefined;
  BudgetDetail: { budgetId: string };
  CreateBudget: undefined;
  EditBudget: { budgetId: string };
};

export type TransactionStackParamList = {
  TransactionList: undefined;
  TransactionDetail: { transactionId: string };
  CreateTransaction: undefined;
  EditTransaction: { transactionId: string };
};

export type ReceiptStackParamList = {
  ReceiptList: undefined;
  ReceiptDetail: { receiptId: string };
  UploadReceipt: undefined;
};
