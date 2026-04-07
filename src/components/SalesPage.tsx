import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { formatCurrency, getToday } from '@/lib/store';
import { Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const SalesPage = () => {
  const { state, t, addTransaction, deleteTransaction } = useApp();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const sales = state.transactions.filter(tx => tx.type === 'sale');

  const handleAdd = () => {
    if (!amount || !description) return;
    addTransaction({
      type: 'sale',
      amount: Number(amount),
      description,
      category: 'sale',
      date: getToday(),
    });
    setAmount('');
    setDescription('');
    setOpen(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-foreground">{t('allSales')}</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-primary border-0 text-primary-foreground gap-1">
              <Plus className="w-4 h-4" /> {t('addSale')}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle className="font-display">{t('addSale')}</DialogTitle>
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
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>{t('cancel')}</Button>
                <Button className="flex-1 gradient-primary border-0 text-primary-foreground" onClick={handleAdd}>{t('save')}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {sales.length === 0 ? (
        <Card className="border border-border">
          <CardContent className="p-8 text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">{t('noData')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {sales.map(tx => (
            <Card key={tx.id} className="border border-border shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-profit">+{formatCurrency(tx.amount, state.currency)}</span>
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

export default SalesPage;
