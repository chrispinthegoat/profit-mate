import { useApp } from '@/contexts/useApp';
import { Bell, Check, Trash2, X } from 'lucide-react';
import type { AppNotification } from '@/lib/notifications';

interface Props {
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onClear: () => void;
  onClose: () => void;
}

const NotificationPanel = ({ notifications, onMarkAllRead, onClear, onClose }: Props) => {
  const { t } = useApp();

  const iconMap: Record<string, string> = {
    sale: '💰',
    expense: '🧾',
    profit: '📊',
    update: '🔔',
  };

  const timeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t('justNow');
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 max-h-96 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="font-display font-bold text-sm text-foreground">{t('notifications')}</h3>
        <div className="flex items-center gap-1">
          {notifications.length > 0 && (
            <>
              <button onClick={onMarkAllRead} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title={t('markAllRead')}>
                <Check className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <button onClick={onClear} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title={t('clearAll')}>
                <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </>
          )}
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
      <div className="overflow-y-auto max-h-72">
        {notifications.length === 0 ? (
          <div className="p-6 text-center">
            <Bell className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{t('noNotifications')}</p>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              className={`px-3 py-2.5 border-b border-border/50 last:border-0 transition-colors ${
                !n.read ? 'bg-primary/5' : ''
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-lg mt-0.5">{iconMap[n.type] || '🔔'}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-relaxed ${!n.read ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {n.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">{timeAgo(n.timestamp)}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
