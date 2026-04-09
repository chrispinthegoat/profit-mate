import { useApp } from '@/contexts/useApp';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onAccept: () => void;
  onDecline: () => void;
}

const NotificationPrompt = ({ onAccept, onDecline }: Props) => {
  const { t } = useApp();

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      <div className="bg-card rounded-t-2xl sm:rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-xl border border-border">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Bell className="w-7 h-7 text-primary" />
          </div>
        </div>
        <div className="text-center space-y-1.5">
          <h3 className="font-display font-bold text-lg text-foreground">{t('enableNotifications')}</h3>
          <p className="text-sm text-muted-foreground">{t('notifPromptDesc')}</p>
        </div>
        <div className="space-y-2">
          <Button onClick={onAccept} className="w-full gradient-primary border-0 text-primary-foreground">
            {t('yesNotify')}
          </Button>
          <Button onClick={onDecline} variant="ghost" className="w-full text-muted-foreground">
            {t('noThanks')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPrompt;
