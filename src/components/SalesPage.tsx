import { useState } from 'react';
import { useApp } from '@/contexts/useApp';
import { formatCurrency, getToday } from '@/lib/store';
import { Plus, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { Product } from '@/components/ProductsPage';

interface SaleRecord {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  note?: string;
  date: string;
  createdAt: string;
}

interface SalesPageProps {
  products: Product[];
  sales: SaleRecord[];
  onRecordSale: (sale: { productId: string; quantity: number; note?: string }) => void;
}

const SalesPage = ({ products, sales, onRecordSale }: SalesPageProps) => {
  const { state, t } = useApp();
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [note, setNote] = useState('');

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const availableProducts = products.filter(p => p.stockQuantity > 0);

  const handleRecordSale = () => {
    if (!selectedProductId || !quantity || Number(quantity) < 1) {
      toast.error('Please select a product and quantity');
      return;
    }
    if (!selectedProduct) return;
    if (Number(quantity) > selectedProduct.stockQuantity) {
      toast.error(`Only ${selectedProduct.stockQuantity} available in stock`);
      return;
    }

    onRecordSale({
      productId: selectedProductId,
      quantity: Number(quantity),
      note: note.trim() || undefined,
    });

    toast.success(`Sold ${quantity}x ${selectedProduct.name}!`);
    setSelectedProductId('');
    setQuantity('1');
    setNote('');
    setOpen(false);
  };

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalPrice, 0);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-foreground">{t('allSales')}</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-primary border-0 text-primary-foreground gap-1 h-10 px-4" disabled={availableProducts.length === 0}>
              <Plus className="w-4 h-4" /> {t('addSale')}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle className="font-display">{t('addSale')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-sm font-medium text-foreground">Select Product</label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger className="mt-1 h-12">
                    <SelectValue placeholder="Choose a product..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} — {formatCurrency(p.price, state.currency)} (stock: {p.stockQuantity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedProduct && (
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Unit price: <span className="font-bold text-foreground">{formatCurrency(selectedProduct.price, state.currency)}</span></span>
                    <span>Available: <span className="font-bold text-foreground">{selectedProduct.stockQuantity}</span></span>
                  </div>
                  {quantity && Number(quantity) > 0 && (
                    <p className="text-sm font-bold text-foreground mt-1.5">
                      Total: {formatCurrency(selectedProduct.price * Number(quantity), state.currency)}
                    </p>
                  )}
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-foreground">Quantity</label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  placeholder="1"
                  className="mt-1 h-12 text-xl font-display font-bold"
                  inputMode="numeric"
                  min={1}
                  max={selectedProduct?.stockQuantity}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Note (optional)</label>
                <Input value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Customer name..." className="mt-1 h-11" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 h-12" onClick={() => setOpen(false)}>{t('cancel')}</Button>
                <Button className="flex-1 h-12 gradient-primary border-0 text-primary-foreground font-bold" onClick={handleRecordSale}>
                  {t('save')} ✓
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Revenue summary */}
      {sales.length > 0 && (
        <Card className="border-0 gradient-primary shadow-md">
          <CardContent className="p-4">
            <p className="text-primary-foreground/70 text-xs font-medium">Total Revenue</p>
            <p className="text-2xl font-display font-extrabold text-primary-foreground">
              {formatCurrency(totalRevenue, state.currency)}
            </p>
            <p className="text-primary-foreground/50 text-xs mt-1">{sales.length} sales recorded</p>
          </CardContent>
        </Card>
      )}

      {availableProducts.length === 0 && products.length === 0 && (
        <Card className="border border-border">
          <CardContent className="p-6 text-center">
            <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">Add products first to start recording sales</p>
            <p className="text-muted-foreground/70 text-xs mt-1">Go to the Products tab to add your inventory</p>
          </CardContent>
        </Card>
      )}

      {sales.length === 0 && products.length > 0 ? (
        <Card className="border border-border">
          <CardContent className="p-8 text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">{t('noData')}</p>
            <p className="text-muted-foreground/70 text-xs mt-1">Record your first sale</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {sales.map(sale => (
            <Card key={sale.id} className="border border-border shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{sale.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {sale.quantity}x @ {formatCurrency(sale.unitPrice, state.currency)}
                    {sale.note && ` • ${sale.note}`}
                  </p>
                  <p className="text-xs text-muted-foreground">{sale.date}</p>
                </div>
                <span className="text-sm font-bold text-profit">+{formatCurrency(sale.totalPrice, state.currency)}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesPage;
