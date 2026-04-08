import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { AppContext } from './app-context';
import { type AppState, type Feedback, type Transaction, loadState, saveState, generateId } from '@/lib/store';
import { type Language, t as translate } from '@/lib/i18n';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const tFn = useCallback((key: string) => translate(key, state.language), [state.language]);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    setState(prev => ({
      ...prev,
      transactions: [{ ...tx, id: generateId(), createdAt: new Date().toISOString() }, ...prev.transactions],
    }));
  }, []);

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

  return (
    <AppContext.Provider value={{ state, t: tFn, addTransaction, deleteTransaction, addFeedback, setLanguage, setPlan, setCurrency }}>
      {children}
    </AppContext.Provider>
  );
}
