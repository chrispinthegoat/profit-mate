import { createContext } from 'react';
import type { Language } from '@/lib/i18n';
import type { AppState, Feedback, Transaction, Theme } from '@/lib/store';
import type { AppNotification } from '@/lib/notifications';

export interface AppContextType {
  state: AppState;
  t: (key: string) => string;
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  addFeedback: (fb: Omit<Feedback, 'id' | 'createdAt'>) => void;
  setLanguage: (lang: Language) => void;
  setPlan: (plan: 'free' | 'basic' | 'pro') => void;
  setCurrency: (currency: string) => void;
  setTheme: (theme: Theme) => void;
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (type: AppNotification['type'], message: string) => void;
  markAllRead: () => void;
  clearNotifications: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const AppContext = createContext<AppContextType | null>(null);
