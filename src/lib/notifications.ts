export interface AppNotification {
  id: string;
  type: 'sale' | 'expense' | 'profit' | 'update';
  message: string;
  timestamp: string;
  read: boolean;
}

const NOTIF_KEY = 'profitmate_notifications';
const NOTIF_PREF_KEY = 'profitmate_notif_enabled';

export function loadNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveNotifications(notifs: AppNotification[]): void {
  try {
    // Keep only the last 50 notifications
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs.slice(0, 50)));
  } catch {}
}

export function getNotifPreference(): boolean | null {
  try {
    const raw = localStorage.getItem(NOTIF_PREF_KEY);
    if (raw === null) return null; // never asked
    return raw === 'true';
  } catch {}
  return null;
}

export function setNotifPreference(enabled: boolean): void {
  try {
    localStorage.setItem(NOTIF_PREF_KEY, String(enabled));
  } catch {}
}
