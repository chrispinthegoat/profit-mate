import { Language } from './i18n';

export interface Transaction {
  id: string;
  type: 'sale' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string; // ISO string
  createdAt: string;
}

export interface Feedback {
  id: string;
  type: 'issue' | 'review';
  title?: string;
  content: string;
  rating?: number;
  createdAt: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface AppState {
  transactions: Transaction[];
  feedbacks: Feedback[];
  language: Language;
  plan: 'free' | 'basic' | 'pro';
  currency: string;
  notificationsEnabled: boolean | null; // null = never asked
  theme: Theme;
}

const STORAGE_KEY = 'profitmate_data';

const defaultState: AppState = {
  transactions: [],
  feedbacks: [],
  language: 'en',
  plan: 'free',
  currency: 'RWF',
  notificationsEnabled: null,
  theme: 'light',
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultState, ...JSON.parse(raw) };
  } catch {}
  return { ...defaultState };
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function getTodayTransactions(transactions: Transaction[]): Transaction[] {
  const today = getToday();
  return transactions.filter(tx => tx.date.startsWith(today));
}

export function getWeekTransactions(transactions: Transaction[]): Transaction[] {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return transactions.filter(tx => new Date(tx.date) >= startOfWeek);
}

export function calcProfit(transactions: Transaction[]): number {
  const sales = transactions.filter(tx => tx.type === 'sale').reduce((s, tx) => s + tx.amount, 0);
  const expenses = transactions.filter(tx => tx.type === 'expense').reduce((s, tx) => s + tx.amount, 0);
  return sales - expenses;
}

export function calcTotal(transactions: Transaction[], type: 'sale' | 'expense'): number {
  return transactions.filter(tx => tx.type === type).reduce((s, tx) => s + tx.amount, 0);
}

export function formatCurrency(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString()}`;
}

export function getWeekDayTotals(transactions: Transaction[]): { day: string; sales: number; expenses: number; profit: number }[] {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return days.map((day, i) => {
    const dayDate = new Date(startOfWeek);
    dayDate.setDate(startOfWeek.getDate() + i);
    const dayStr = dayDate.toISOString().split('T')[0];
    const dayTx = transactions.filter(tx => tx.date.startsWith(dayStr));
    const sales = calcTotal(dayTx, 'sale');
    const expenses = calcTotal(dayTx, 'expense');
    return { day, sales, expenses, profit: sales - expenses };
  });
}
