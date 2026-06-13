import { useState } from 'react';
import { useApp } from '@/contexts/useApp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Star, MessageSquare, CheckCircle2, HelpCircle, BookOpen, Package, ShoppingBag, Receipt, BarChart3, WifiOff, Mail } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';

const FeedbackPage = () => {
  const { t, addFeedback } = useApp();
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleIssue = () => {
    if (!issueTitle || !issueDesc) return;
    addFeedback({ type: 'issue', title: issueTitle, content: issueDesc });
    setIssueTitle('');
    setIssueDesc('');
    toast.success(t('thankYou'), { icon: <CheckCircle2 className="w-4 h-4" /> });
  };

  const handleReview = () => {
    if (!reviewText || !rating) return;
    addFeedback({ type: 'review', content: reviewText, rating });
    setReviewText('');
    setRating(0);
    toast.success(t('thankYou'), { icon: <CheckCircle2 className="w-4 h-4" /> });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-display font-bold text-foreground">{t('feedback')}</h2>
      </div>

      {/* Quick Start Guide */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Quick Start Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-3">
            <Package className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">1. Add your products</p>
              <p className="text-muted-foreground">Go to Products and add items with cost, price, and stock.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <ShoppingBag className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">2. Record sales</p>
              <p className="text-muted-foreground">Tap Sales and pick a product — stock and profit update automatically.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Receipt className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">3. Log expenses</p>
              <p className="text-muted-foreground">Track costs so your real profit is accurate.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <BarChart3 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">4. Check the dashboard</p>
              <p className="text-muted-foreground">See today's sales, expenses, and profit at a glance.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-primary" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="offline">
              <AccordionTrigger className="text-sm text-left">
                <span className="flex items-center gap-2"><WifiOff className="w-4 h-4" /> Does it work offline?</span>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Yes. Once you sign in, ProfitMate works fully offline. Your sales, expenses, and products are saved on your device and stay available without internet.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="profit">
              <AccordionTrigger className="text-sm text-left">How is profit calculated?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Profit = Sales revenue − (product cost × quantity sold) − expenses. It updates automatically whenever you record a sale or expense.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="currency">
              <AccordionTrigger className="text-sm text-left">Can I change language or currency?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Yes. Open Settings to switch between English, Kinyarwanda, Swahili, or French, and choose RWF, KES, UGX, TZS, BIF, or USD.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="lowstock">
              <AccordionTrigger className="text-sm text-left">What are low-stock alerts?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Each product has a low-stock threshold. When stock drops to or below that number, you'll get a notification reminding you to restock.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="plans">
              <AccordionTrigger className="text-sm text-left">What do the paid plans give me?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Basic ($2/month or $20/year) and Pro ($5/month or $50/year) unlock advanced reports, PDF exports, and priority support. Free covers the essentials.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="data">
              <AccordionTrigger className="text-sm text-left">Is my data safe?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Your data is stored securely on your device and synced to your private account. Only you can access it. See our Privacy Policy for details.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="border border-border shadow-sm bg-primary/5">
        <CardContent className="pt-4 flex items-start gap-3">
          <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-foreground">Need more help?</p>
            <p className="text-muted-foreground">Use the form below to report an issue or share feedback — we read every message.</p>
          </div>
        </CardContent>
      </Card>


      {/* Report Issue */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            {t('reportIssue')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground">{t('issueTitle')}</label>
            <Input value={issueTitle} onChange={e => setIssueTitle(e.target.value)} placeholder={t('issueTitle')} className="mt-1 h-12 text-base" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">{t('issueDescription')}</label>
            <Textarea value={issueDesc} onChange={e => setIssueDesc(e.target.value)} placeholder={t('issueDescription')} className="mt-1 text-base" rows={3} />
          </div>
          <Button className="w-full h-12 gradient-primary border-0 text-primary-foreground font-bold" onClick={handleIssue}>{t('submit')}</Button>
        </CardContent>
      </Card>

      {/* Rate & Review */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-secondary" />
            {t('writeReview')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground">{t('rateUs')}</label>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  key={i}
                  onClick={() => setRating(i)}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 active:scale-95 p-1"
                >
                  <Star
                    className={`w-8 h-8 ${
                      i <= (hoverRating || rating)
                        ? 'fill-accent text-accent'
                        : 'text-muted-foreground/30'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">{t('review')}</label>
            <Textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder={t('review')} className="mt-1 text-base" rows={3} />
          </div>
          <Button className="w-full h-12 gradient-secondary border-0 text-secondary-foreground font-bold" onClick={handleReview}>{t('submit')}</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackPage;
