import { useState } from 'react';
import { useApp } from '@/contexts/useApp';
import { formatCurrency } from '@/lib/store';
import { Plus, Trash2, Package, Edit2, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  lowStockThreshold: number;
  createdAt: string;
}

interface ProductsPageProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  onUpdateProduct: (id: string, product: Partial<Omit<Product, 'id' | 'createdAt'>>) => void;
  onDeleteProduct: (id: string) => void;
}

const ProductsPage = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct }: ProductsPageProps) => {
  const { state, t } = useApp();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('10');

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setStockQuantity('');
    setLowStockThreshold('10');
    setEditId(null);
  };

  const handleAdd = () => {
    if (!name.trim() || !price) return;
    if (editId) {
      onUpdateProduct(editId, {
        name: name.trim(),
        description: description.trim() || undefined,
        price: Number(price),
        stockQuantity: Number(stockQuantity) || 0,
        lowStockThreshold: Number(lowStockThreshold) || 10,
      });
      toast.success('Product updated!');
    } else {
      onAddProduct({
        name: name.trim(),
        description: description.trim() || undefined,
        price: Number(price),
        stockQuantity: Number(stockQuantity) || 0,
        lowStockThreshold: Number(lowStockThreshold) || 10,
      });
      toast.success('Product added!');
    }
    resetForm();
    setOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditId(product.id);
    setName(product.name);
    setDescription(product.description || '');
    setPrice(String(product.price));
    setStockQuantity(String(product.stockQuantity));
    setLowStockThreshold(String(product.lowStockThreshold));
    setOpen(true);
  };

  const lowStockProducts = products.filter(p => p.stockQuantity <= p.lowStockThreshold && p.stockQuantity > 0);
  const outOfStockProducts = products.filter(p => p.stockQuantity === 0);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-foreground">Products & Inventory</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-primary border-0 text-primary-foreground gap-1 h-10 px-4">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle className="font-display">{editId ? 'Edit Product' : 'Add Product'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <div>
                <label className="text-sm font-medium text-foreground">Product Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rice, Soap, Sugar..." className="mt-1 h-12 text-base" autoFocus />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Description (optional)</label>
                <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description" className="mt-1 h-11" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground">Price ({state.currency})</label>
                  <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0" className="mt-1 h-12 text-lg font-display font-bold" inputMode="numeric" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Stock Qty</label>
                  <Input type="number" value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} placeholder="0" className="mt-1 h-12 text-lg font-display font-bold" inputMode="numeric" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Low Stock Alert (threshold)</label>
                <Input type="number" value={lowStockThreshold} onChange={e => setLowStockThreshold(e.target.value)} placeholder="10" className="mt-1 h-11" inputMode="numeric" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 h-12" onClick={() => { setOpen(false); resetForm(); }}>{t('cancel')}</Button>
                <Button className="flex-1 h-12 gradient-primary border-0 text-primary-foreground font-bold" onClick={handleAdd}>
                  {editId ? 'Update' : t('save')} ✓
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Low stock warnings */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <Card className="border border-destructive/30 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-sm font-bold text-destructive">Stock Alerts</span>
            </div>
            <div className="space-y-1">
              {outOfStockProducts.map(p => (
                <p key={p.id} className="text-xs text-destructive font-medium">⛔ {p.name} — Out of stock!</p>
              ))}
              {lowStockProducts.map(p => (
                <p key={p.id} className="text-xs text-amber-600 dark:text-amber-400 font-medium">⚠️ {p.name} — Only {p.stockQuantity} left (threshold: {p.lowStockThreshold})</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {products.length === 0 ? (
        <Card className="border border-border">
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No products yet</p>
            <p className="text-muted-foreground/70 text-xs mt-1">Add your first product to start tracking inventory</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {products.map(product => (
            <Card key={product.id} className="border border-border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-foreground">{product.name}</p>
                      {product.stockQuantity === 0 && (
                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Out of stock</Badge>
                      )}
                      {product.stockQuantity > 0 && product.stockQuantity <= product.lowStockThreshold && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-500 text-amber-600 dark:text-amber-400">Low stock</Badge>
                      )}
                    </div>
                    {product.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{product.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-muted-foreground">
                        Price: <span className="font-bold text-foreground">{formatCurrency(product.price, state.currency)}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        In Stock: <span className={`font-bold ${product.stockQuantity <= product.lowStockThreshold ? 'text-destructive' : 'text-foreground'}`}>{product.stockQuantity}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(product)} className="text-muted-foreground hover:text-foreground transition-colors p-1.5">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => { onDeleteProduct(product.id); toast.success('Product deleted'); }} className="text-muted-foreground hover:text-destructive transition-colors p-1.5">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
