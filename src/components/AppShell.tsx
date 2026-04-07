import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import Dashboard from '@/components/Dashboard';
import SalesPage from '@/components/SalesPage';
import ExpensesPage from '@/components/ExpensesPage';
import SettingsPage from '@/components/SettingsPage';
import FeedbackPage from '@/components/FeedbackPage';
import { LayoutDashboard, ShoppingBag, Receipt, Settings, MessageSquare } from 'lucide-react';

type Tab = 'dashboard' | 'sales' | 'expenses' | 'settings' | 'feedback';

const AppShell = () => {
  const { t } = useApp();
  const [tab, setTab] = useState<Tab>('dashboard');

  const tabs: { key: Tab; icon: typeof LayoutDashboard; label: string }[] = [
    { key: 'dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { key: 'sales', icon: ShoppingBag, label: t('sales') },
    { key: 'expenses', icon: Receipt, label: t('expenses') },
    { key: 'settings', icon: Settings, label: t('settings') },
    { key: 'feedback', icon: MessageSquare, label: t('feedback') },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-sm">P</span>
          </div>
          <h1 className="text-lg font-display font-bold text-foreground">Profit Mate</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'sales' && <SalesPage />}
        {tab === 'expenses' && <ExpensesPage />}
        {tab === 'settings' && <SettingsPage />}
        {tab === 'feedback' && <FeedbackPage />}
      </main>

      {/* Bottom Nav */}
      <nav className="sticky bottom-0 bg-card/95 backdrop-blur-lg border-t border-border px-2 py-1 safe-area-pb">
        <div className="flex items-center justify-around">
          {tabs.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all ${
                tab === key
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${tab === key ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AppShell;
