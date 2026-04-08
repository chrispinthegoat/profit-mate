import { useState } from 'react';
import { useApp } from '@/contexts/useApp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Star, MessageSquare, CheckCircle2, HelpCircle } from 'lucide-react';
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
