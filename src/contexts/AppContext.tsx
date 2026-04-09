import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { AppContext } from './app-context';
import { type AppState, type Feedback, type Transaction, loadState, saveState, generateId } from '@/lib/store';
import { type Language, t as translate } from '@/lib/i18n';
import { type AppNotification, loadNotifications, saveNotifications } from '@/lib/notifications';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);
  const [notifications, setNotifications] = useState<AppNotification[]>(loadNotifications);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  const tFn = useCallback((key: string) => translate(key, state.language), [state.language]);

  const addNotification = useCallback((type: AppNotification['type'], message: string) => {
    setNotifications(prev => [
      { id: generateId(), type, message, timestamp: new Date().toISOString(), read: false },
      ...prev,
    ]);
  }, []);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    setState(prev => {
      const newState = {
        ...prev,
        transactions: [{ ...tx, id: generateId(), createdAt: new Date().toISOString() }, ...prev.transactions],
      };
      return newState;
    });
    // Add notification if enabled
    setState(prev => {
      if (prev.notificationsEnabled) {
        const msg = tx.type === 'sale'
          ? translate('notifSaleRecorded', state.language).replace('{desc}', tx.description).replace('{amount}', String(tx.amount))
          : translate('notifExpenseRecorded', state.language).replace('{desc}', tx.description).replace('{amount}', String(tx.amount));
        addNotification(tx.type === 'sale' ? 'sale' : 'expense', msg);
      }
      return prev;
    });
  }, [addNotification, state.language]);

  const deleteTransaction = useCallback((id: string) => {
    setState(prev => ({ ...prev, transactions: prev.transactions.filter(tx => tx.id !== id) }));
  }, []);

  const addFeedback = useCallback((fb: Omit<Feedback, 'id' | 'createdAt'>) => {
    setState(prev => ({
      ...prev,
      feedbacks: [{ ...fb, id: generateId(), createdAt: new Date().toISOString() }, ...prev.feedbacks],
    }));
  }, []);

  const setLanguage = useCallback((language: Language) => {
    setState(prev => ({ ...prev, language }));
  }, []);

  const setPlan = useCallback((plan: 'free' | 'basic' | 'pro') => {
    setState(prev => ({ ...prev, plan }));
  }, []);

  const setCurrency = useCallback((currency: string) => {
    setState(prev => ({ ...prev, currency }));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const setNotificationsEnabled = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, notificationsEnabled: enabled }));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      state, t: tFn, addTransaction, deleteTransaction, addFeedback, setLanguage, setPlan, setCurrency,
      notifications, unreadCount, addNotification, markAllRead, clearNotifications, setNotificationsEnabled,
    }}>
      {children}
    </AppContext.Provider>
  );
}
