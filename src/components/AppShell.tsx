import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/useApp';
import { supabase } from '@/integrations/supabase/client';
import Dashboard from '@/components/Dashboard';
import SalesPage from '@/components/SalesPage';
import ExpensesPage from '@/components/ExpensesPage';
import SettingsPage from '@/components/SettingsPage';
import FeedbackPage from '@/components/FeedbackPage';
import NotificationPanel from '@/components/NotificationPanel';
import NotificationPrompt from '@/components/NotificationPrompt';
import { Home, ShoppingBag, Receipt, Settings, HelpCircle, User, LogOut, Bell, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';

type Tab = 'dashboard' | 'sales' | 'expenses' | 'settings' | 'feedback';

const AppShell = () => {
  const { t, state, notifications, unreadCount, markAllRead, clearNotifications, setNotificationsEnabled } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [user, setUser] = useState<any>(null);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Show notification prompt after a short delay if never asked
  useEffect(() => {
    if (state.notificationsEnabled === null) {
      const timer = setTimeout(() => setShowNotifPrompt(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [state.notificationsEnabled]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out');
  };

  const tabs: { key: Tab; icon: typeof Home; label: string }[] = [
    { key: 'dashboard', icon: Home, label: t('dashboard') },
    { key: 'sales', icon: ShoppingBag, label: t('sales') },
    { key: 'expenses', icon: Receipt, label: t('expenses') },
    { key: 'settings', icon: Settings, label: t('settings') },
    { key: 'feedback', icon: HelpCircle, label: t('feedback') },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      {/* Notification Prompt */}
      {showNotifPrompt && (
        <NotificationPrompt
          onAccept={() => {
            setNotificationsEnabled(true);
            setShowNotifPrompt(false);
            toast.success(t('notifEnabled'));
          }}
          onDecline={() => {
            setNotificationsEnabled(false);
            setShowNotifPrompt(false);
          }}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-display font-extrabold text-base">P</span>
            </div>
            <div>
              <h1 className="text-lg font-display font-extrabold text-foreground leading-tight">ProfitMate</h1>
              <p className="text-[10px] text-muted-foreground leading-tight">{t('yourShop')}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* Theme toggle */}
            <button
              onClick={() => {
                const isDark = document.documentElement.classList.contains('dark');
                document.documentElement.classList.toggle('dark', !isDark);
                try { localStorage.setItem('profitmate_data', JSON.stringify({ ...JSON.parse(localStorage.getItem('profitmate_data') || '{}'), theme: isDark ? 'light' : 'dark' })); } catch {}
              }}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              <Sun className="w-5 h-5 text-muted-foreground hidden dark:block" />
              <Moon className="w-5 h-5 text-muted-foreground block dark:hidden" />
            </button>
            {/* Bell icon */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setShowNotifPanel(!showNotifPanel)}
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {showNotifPanel && (
                <NotificationPanel
                  notifications={notifications}
                  onMarkAllRead={markAllRead}
                  onClear={clearNotifications}
                  onClose={() => setShowNotifPanel(false)}
                />
              )}
            </div>
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
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
