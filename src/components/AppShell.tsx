import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import Dashboard from '@/components/Dashboard';
import SalesPage from '@/components/SalesPage';
import ExpensesPage from '@/components/ExpensesPage';
import SettingsPage from '@/components/SettingsPage';
import FeedbackPage from '@/components/FeedbackPage';
import { Home, ShoppingBag, Receipt, Settings, HelpCircle } from 'lucide-react';

type Tab = 'dashboard' | 'sales' | 'expenses' | 'settings' | 'feedback';

const AppShell = () => {
  const { t } = useApp();
  const [tab, setTab] = useState<Tab>('dashboard');

  const tabs: { key: Tab; icon: typeof Home; label: string }[] = [
    { key: 'dashboard', icon: Home, label: t('dashboard') },
    { key: 'sales', icon: ShoppingBag, label: t('sales') },
    { key: 'expenses', icon: Receipt, label: t('expenses') },
    { key: 'settings', icon: Settings, label: t('settings') },
    { key: 'feedback', icon: HelpCircle, label: t('feedback') },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground font-display font-extrabold text-base">P</span>
          </div>
          <div>
            <h1 className="text-lg font-display font-extrabold text-foreground leading-tight">ProfitMate</h1>
            <p className="text-[10px] text-muted-foreground leading-tight">{t('yourShop')}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-20">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'sales' && <SalesPage />}
        {tab === 'expenses' && <ExpensesPage />}
        {tab === 'settings' && <SettingsPage />}
        {tab === 'feedback' && <FeedbackPage />}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-card/95 backdrop-blur-lg border-t border-border px-2 py-1.5 z-20">
        <div className="flex items-center justify-around">
          {tabs.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[56px] active:scale-95 ${
                tab === key
                  ? 'text-primary bg-primary/5'
                  : 'text-muted-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${tab === key ? 'scale-110' : ''} transition-transform`} strokeWidth={tab === key ? 2.5 : 2} />
              <span className="text-[10px] font-medium leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AppShell;
