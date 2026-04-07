import { useApp } from '@/contexts/AppContext';
import { getTodayTransactions, getWeekTransactions, calcProfit, calcTotal, formatCurrency, getWeekDayTotals } from '@/lib/store';
import { TrendingUp, TrendingDown, ShoppingBag, Receipt, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const { state, t } = useApp();
  const { transactions, currency } = state;
  
  const todayTx = getTodayTransactions(transactions);
  const weekTx = getWeekTransactions(transactions);
  const todayProfit = calcProfit(todayTx);
  const todaySales = calcTotal(todayTx, 'sale');
  const todayExpenses = calcTotal(todayTx, 'expense');
  const weeklyProfit = calcProfit(weekTx);
  const weekDays = getWeekDayTotals(transactions);
  
  const recentTx = transactions.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Today's Profit - Hero Card */}
      <Card className="gradient-primary border-0 shadow-lg">
        <CardContent className="p-6">
          <p className="text-primary-foreground/70 text-sm font-medium">{t('todayProfit')}</p>
          <div className="flex items-center gap-3 mt-1">
            <h2 className="text-3xl font-display font-bold text-primary-foreground">
              {formatCurrency(todayProfit, currency)}
            </h2>
            {todayProfit >= 0 ? (
              <TrendingUp className="w-6 h-6 text-primary-foreground/80" />
            ) : (
              <TrendingDown className="w-6 h-6 text-primary-foreground/80" />
            )}
          </div>
          <p className="text-primary-foreground/60 text-xs mt-2">{t('offlineNotice')}</p>
        </CardContent>
      </Card>

      {/* Today Stats */}
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

      {/* Weekly Summary */}
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

      {/* Recent Transactions */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display">{t('recentTransactions')}</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTx.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">{t('noData')}</p>
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
                      <p className="text-xs text-muted-foreground">{tx.category}</p>
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
    </div>
  );
};

export default Dashboard;
