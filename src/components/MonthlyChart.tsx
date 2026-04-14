import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, Legend } from 'recharts';
import { useApp } from '@/contexts/useApp';
import { formatCurrency, type Transaction } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface MonthlyData {
  month: string;
  monthLabel: string;
  sales: number;
  expenses: number;
  profit: number;
}

function getMonthlyData(transactions: Transaction[], year: number): MonthlyData[] {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return monthNames.map((name, i) => {
    const monthTx = transactions.filter(tx => {
      const d = new Date(tx.date);
      return d.getFullYear() === year && d.getMonth() === i;
    });
    const sales = monthTx.filter(tx => tx.type === 'sale').reduce((s, tx) => s + tx.amount, 0);
    const expenses = monthTx.filter(tx => tx.type === 'expense').reduce((s, tx) => s + tx.amount, 0);
    return { month: `${year}-${String(i + 1).padStart(2, '0')}`, monthLabel: name, sales, expenses, profit: sales - expenses };
  });
}

function getAvailableYears(transactions: Transaction[]): number[] {
  const years = new Set<number>();
  transactions.forEach(tx => years.add(new Date(tx.date).getFullYear()));
  const currentYear = new Date().getFullYear();
  years.add(currentYear);
  return Array.from(years).sort((a, b) => b - a);
}

const MonthlyChart = () => {
  const { state, t } = useApp();
  const { transactions, currency } = state;

  const availableYears = useMemo(() => getAvailableYears(transactions), [transactions]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const monthlyData = useMemo(() => getMonthlyData(transactions, selectedYear), [transactions, selectedYear]);

  const yearTotals = useMemo(() => {
    const sales = monthlyData.reduce((s, d) => s + d.sales, 0);
    const expenses = monthlyData.reduce((s, d) => s + d.expenses, 0);
    return { sales, expenses, profit: sales - expenses };
  }, [monthlyData]);

  const hasData = monthlyData.some(d => d.sales > 0 || d.expenses > 0);

  if (transactions.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Year Selector & Yearly Summary */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t('yearlyReport') || 'Yearly Report'}
            </CardTitle>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="text-sm bg-muted rounded-lg px-3 py-1.5 border-0 font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {availableYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-3 rounded-xl bg-primary/5">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{t('sales')}</p>
              <p className="text-sm font-display font-bold text-primary mt-1">{formatCurrency(yearTotals.sales, currency)}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-secondary/5">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{t('expenses')}</p>
              <p className="text-sm font-display font-bold text-secondary mt-1">{formatCurrency(yearTotals.expenses, currency)}</p>
            </div>
            <div className={`text-center p-3 rounded-xl ${yearTotals.profit >= 0 ? 'bg-green-500/5' : 'bg-red-500/5'}`}>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{t('profit')}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                {yearTotals.profit >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-profit" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-loss" />
                )}
                <p className={`text-sm font-display font-bold ${yearTotals.profit >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {formatCurrency(Math.abs(yearTotals.profit), currency)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Comparison Chart */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display">
            {t('monthlyComparison') || 'Monthly Comparison'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          {!hasData ? (
            <p className="text-sm text-muted-foreground text-center py-8">{t('noData')}</p>
          ) : (
            <div className="h-64 -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis
                    dataKey="monthLabel"
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      fontSize: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value: number, name: string) => [
                      formatCurrency(value, currency),
                      name === 'sales' ? t('sales') : name === 'expenses' ? t('expenses') : t('profit'),
                    ]}
                    labelFormatter={(label) => `${label} ${selectedYear}`}
                  />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={12} name="sales" />
                  <Bar dataKey="expenses" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} barSize={12} name="expenses" />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="hsl(142, 71%, 45%)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: 'hsl(142, 71%, 45%)' }}
                    name="profit"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Legend */}
          {hasData && (
            <div className="flex items-center justify-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-primary" />
                <span className="text-xs text-muted-foreground">{t('sales')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-secondary" />
                <span className="text-xs text-muted-foreground">{t('expenses')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(142, 71%, 45%)' }} />
                <span className="text-xs text-muted-foreground">{t('profit')}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyChart;
