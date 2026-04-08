import { createContext } from 'react';
import type { Language } from '@/lib/i18n';
import type { AppState, Feedback, Transaction } from '@/lib/store';

export interface AppContextType {
  state: AppState;
  t: (key: string) => string;
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  addFeedback: (fb: Omit<Feedback, 'id' | 'createdAt'>) => void;
  setLanguage: (lang: Language) => void;
  setPlan: (plan: 'free' | 'basic' | 'pro') => void;
  setCurrency: (currency: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null);
