import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { formatCurrency, getToday } from '@/lib/store';
import { Plus, Trash2, Receipt } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const categories = ['food', 'transport', 'rent', 'supplies', 'utilities', 'other'];

const ExpensesPage = () => {
  const { state, t, addTransaction, deleteTransaction } = useApp();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');

  const expenses = state.transactions.filter(tx => tx.type === 'expense');

  const handleAdd = () => {
    if (!amount || !description) return;
    addTransaction({
      type: 'expense',
      amount: Number(amount),
      description,
      category: t(category),
      date: getToday(),
    });
    setAmount('');
    setDescription('');
    setCategory('other');
    setOpen(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-foreground">{t('allExpenses')}</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-secondary border-0 text-secondary-foreground gap-1">
              <Plus className="w-4 h-4" /> {t('addExpense')}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle className="font-display">{t('addExpense')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-sm font-medium text-foreground">{t('description')}</label>
                <Input value={description} onChange={e => setDescription(e.target.value)} placeholder={t('description')} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">{t('amount')} ({state.currency})</label>
                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">{t('category')}</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c} value={c}>{t(c)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>{t('cancel')}</Button>
                <Button className="flex-1 gradient-secondary border-0 text-secondary-foreground" onClick={handleAdd}>{t('save')}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {expenses.length === 0 ? (
        <Card className="border border-border">
          <CardContent className="p-8 text-center">
            <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">{t('noData')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {expenses.map(tx => (
            <Card key={tx.id} className="border border-border shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.category} · {tx.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-loss">-{formatCurrency(tx.amount, state.currency)}</span>
                  <button onClick={() => deleteTransaction(tx.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;
