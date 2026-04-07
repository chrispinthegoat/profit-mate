import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AppState, Transaction, Feedback, loadState, saveState, generateId } from '@/lib/store';
import { Language, t as translate } from '@/lib/i18n';

interface AppContextType {
  state: AppState;
  t: (key: string) => string;
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  addFeedback: (fb: Omit<Feedback, 'id' | 'createdAt'>) => void;
  setLanguage: (lang: Language) => void;
  setPlan: (plan: 'free' | 'basic' | 'pro') => void;
  setCurrency: (currency: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => { saveState(state); }, [state]);

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

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
