
import { Category, Transaction } from './types';

export const CATEGORIES: Record<string, Category> = {
  food: { id: 'food', name: 'Food', icon: 'Utensils', color: 'bg-orange-500' },
  transport: { id: 'transport', name: 'Transport', icon: 'Car', color: 'bg-blue-500' },
  shopping: { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: 'bg-pink-500' },
  entertainment: { id: 'entertainment', name: 'Fun', icon: 'Ticket', color: 'bg-purple-500' },
  salary: { id: 'salary', name: 'Salary', icon: 'Briefcase', color: 'bg-emerald-500' },
  freelance: { id: 'freelance', name: 'Freelance', icon: 'Code', color: 'bg-indigo-500' },
  health: { id: 'health', name: 'Health', icon: 'HeartPulse', color: 'bg-red-500' },
  other: { id: 'other', name: 'Other', icon: 'CircleEllipsis', color: 'bg-zinc-500' },
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    amount: 2500,
    type: 'income',
    category: 'salary',
    date: new Date().toISOString(),
    note: 'Monthly Salary',
  },
  {
    id: '2',
    amount: 45.50,
    type: 'expense',
    category: 'food',
    date: new Date().toISOString(),
    note: 'Dinner at Zen Garden',
  },
  {
    id: '3',
    amount: 15.00,
    type: 'expense',
    category: 'transport',
    date: new Date(Date.now() - 86400000).toISOString(),
    note: 'Uber ride',
  },
  {
    id: '4',
    amount: 120.00,
    type: 'expense',
    category: 'shopping',
    date: new Date(Date.now() - 172800000).toISOString(),
    note: 'Nike Shoes',
  },
];
