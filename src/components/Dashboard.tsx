import { useState } from 'react';
import { useApp } from '@/contexts/useApp';
import { getTodayTransactions, getWeekTransactions, calcProfit, calcTotal, formatCurrency, getWeekDayTotals, getToday } from '@/lib/store';
import { TrendingUp, TrendingDown, ShoppingBag, Receipt, ArrowUpRight, ArrowDownRight, Plus, Sparkles, FileDown } from 'lucide-react';
import { exportTransactionsPdf } from '@/lib/exportPdf';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const Dashboard = () => {
  const { state, t, addTransaction } = useApp();
  const { transactions, currency } = state;
  
  const todayTx = getTodayTransactions(transactions);
  const weekTx = getWeekTransactions(transactions);
  const todayProfit = calcProfit(todayTx);
  const todaySales = calcTotal(todayTx, 'sale');
  const todayExpenses = calcTotal(todayTx, 'expense');
  const weeklyProfit = calcProfit(weekTx);
  const weekDays = getWeekDayTotals(transactions);
  const recentTx = transactions.slice(0, 5);
  const isFirstTime = transactions.length === 0;

  const [quickAddType, setQuickAddType] = useState<'sale' | 'expense' | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleQuickAdd = () => {
    if (!amount || !description || !quickAddType) return;
    addTransaction({
      type: quickAddType,
      amount: Number(amount),
      description,
      category: quickAddType === 'sale' ? 'sale' : t('other'),
      date: getToday(),
    });
    toast.success(t('recorded'));
    setAmount('');
    setDescription('');
    setQuickAddType(null);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Welcome Banner for first-time users */}
      {isFirstTime && (
        <Card className="border-0 gradient-primary shadow-lg">
          <CardContent className="p-5">
            <h2 className="text-xl font-display font-bold text-primary-foreground mb-1">{t('welcomeTitle')}</h2>
            <p className="text-primary-foreground/80 text-sm mb-4">{t('welcomeSubtitle')}</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">1</span>
                <p className="text-primary-foreground/90 text-sm">{t('welcomeStep1')}</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">2</span>
                <p className="text-primary-foreground/90 text-sm">{t('welcomeStep2')}</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">3</span>
                <p className="text-primary-foreground/90 text-sm">{t('welcomeStep3')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Profit - Hero Card */}
      {!isFirstTime && (
        <Card className="border-0 gradient-primary shadow-lg">
          <CardContent className="p-5">
            <p className="text-primary-foreground/70 text-sm font-medium">{t('todayProfit')}</p>
            <div className="flex items-center gap-3 mt-1">
              <h2 className="text-3xl font-display font-extrabold text-primary-foreground">
                {formatCurrency(todayProfit, currency)}
              </h2>
              {todayProfit >= 0 ? (
                <TrendingUp className="w-6 h-6 text-primary-foreground/80" />
              ) : (
                <TrendingDown className="w-6 h-6 text-primary-foreground/80" />
              )}
            </div>
            <p className="text-primary-foreground/50 text-xs mt-2">{t('offlineNotice')}</p>
          </CardContent>
        </Card>
      )}

      {/* BIG Action Buttons — the main thing */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setQuickAddType('sale')}
          className="flex flex-col items-center gap-2 p-5 rounded-xl gradient-primary shadow-md active:scale-95 transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Plus className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-sm font-display font-bold text-primary-foreground">{t('addSale')}</span>
        </button>
        <button
          onClick={() => setQuickAddType('expense')}
          className="flex flex-col items-center gap-2 p-5 rounded-xl gradient-secondary shadow-md active:scale-95 transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-secondary-foreground/20 flex items-center justify-center">
            <Receipt className="w-6 h-6 text-secondary-foreground" />
          </div>
          <span className="text-sm font-display font-bold text-secondary-foreground">{t('addExpense')}</span>
        </button>
      </div>

      {/* Quick Add Dialog */}
      <Dialog open={quickAddType !== null} onOpenChange={(open) => { if (!open) setQuickAddType(null); }}>
        <DialogContent className="bg-card max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {quickAddType === 'sale' ? t('addSale') : t('addExpense')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-foreground">
                {quickAddType === 'sale' ? t('description') : t('descriptionExpense')}
              </label>
              <Input
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={quickAddType === 'sale' ? t('salePlaceholder') : t('expensePlaceholder')}
                className="mt-1 h-12 text-base"
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">{t('howMuch')} ({currency})</label>
              <Input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0"
                className="mt-1 h-12 text-xl font-display font-bold"
                inputMode="numeric"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1 h-12" onClick={() => setQuickAddType(null)}>{t('cancel')}</Button>
              <Button
                className={`flex-1 h-12 text-base font-bold border-0 ${quickAddType === 'sale' ? 'gradient-primary text-primary-foreground' : 'gradient-secondary text-secondary-foreground'}`}
                onClick={handleQuickAdd}
              >
                {t('save')} ✓
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Today Stats — only show after first record */}
      {!isFirstTime && (
        <div className="grid grid-cols-2 gap-3">
          <Card className="border border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{t('todaySales')}</span>
              </div>
              <p className="text-lg font-display font-bold text-foreground">{formatCurrency(todaySales, currency)}</p>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg gradient-secondary flex items-center justify-center">
                  <Receipt className="w-4 h-4 text-secondary-foreground" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{t('todayExpenses')}</span>
              </div>
              <p className="text-lg font-display font-bold text-foreground">{formatCurrency(todayExpenses, currency)}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Weekly Summary */}
      {!isFirstTime && (
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display flex items-center justify-between">
              {t('weeklySummary')}
              <span className={`text-sm font-bold ${weeklyProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
                {formatCurrency(weeklyProfit, currency)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex items-end gap-1 h-24">
              {weekDays.map((d) => {
                const maxVal = Math.max(...weekDays.map(dd => Math.max(dd.sales, dd.expenses)), 1);
                const height = Math.max((d.sales / maxVal) * 100, 4);
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col items-center justify-end h-20">
                      <div
                        className="w-full rounded-t-sm gradient-primary transition-all"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">{t(d.day)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display">{t('recentTransactions')}</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTx.length === 0 ? (
            <div className="py-6 text-center">
              <Sparkles className="w-10 h-10 text-accent mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{t('tapToStart')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTx.map(tx => (
                <div key={tx.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'sale' ? 'bg-primary/10' : 'bg-secondary/10'}`}>
                      {tx.type === 'sale' ? (
                        <ArrowUpRight className="w-4 h-4 text-primary" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-secondary" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${tx.type === 'sale' ? 'text-profit' : 'text-loss'}`}>
                    {tx.type === 'sale' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export PDF */}
      {!isFirstTime && (
        <Button
          variant="outline"
          className="w-full h-12 gap-2 font-display font-bold"
          onClick={() => exportTransactionsPdf(transactions, currency, {
            title: t('reportTitle'),
            sales: t('sales'),
            expenses: t('expenses'),
            totalSales: t('totalSales'),
            totalExpenses: t('totalExpenses'),
            netProfit: t('netProfit'),
            date: t('date'),
            description: t('description'),
            amount: t('amount'),
            category: t('category'),
            noData: t('noData'),
          })}
        >
          <FileDown className="w-5 h-5" />
          {t('exportPdf')}
        </Button>
      )}

      {/* Offline badge */}
      {isFirstTime && (
        <p className="text-center text-xs text-muted-foreground pb-4">{t('offlineNotice')}</p>
      )}
    </div>
  );
};

export default Dashboard;
