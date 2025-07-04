export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseFormData {
  amount: string;
  category: string;
  date: string;
  description: string;
  paymentMethod: string;
}

export interface ExpenseStats {
  totalExpenses: number;
  monthlyTotal: number;
  categoryBreakdown: Record<string, number>;
  recentExpenses: Expense[];
}

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Personal Care',
  'Home & Garden',
  'Gifts & Donations',
  'Business',
  'Other'
] as const;

export const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Digital Wallet',
  'Check',
  'Other'
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type PaymentMethod = typeof PAYMENT_METHODS[number];