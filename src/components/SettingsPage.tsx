import { useState } from 'react';
import { useApp } from '@/contexts/useApp';
import { Language, languageNames } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Sparkles, Phone, Copy, ChevronDown, ChevronUp, Sun, Moon, Monitor } from 'lucide-react';
import { Theme } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const plans = [
  {
    key: 'free' as const,
    price: '$0',
    features: ['basicFeatures', 'basicFeatures2', 'basicFeatures3'],
    icon: Sparkles,
    popular: false,
  },
  {
    key: 'basic' as const,
    price: '$2',
    features: ['proFeatures', 'proFeatures2', 'proFeatures3', 'proFeatures4'],
    icon: Crown,
    popular: true,
  },
  {
    key: 'pro' as const,
    price: '$5',
    features: ['premiumFeatures', 'premiumFeatures2', 'premiumFeatures3', 'premiumFeatures4'],
    icon: Crown,
    popular: false,
  },
];

const currencies = ['RWF', 'KES', 'UGX', 'TZS', 'BIF', 'USD'];

const ussdCodes = {
  basic: { mtn: '*182*8*1*PROFITMATE*2000#', airtel: '*185*9*1*PROFITMATE*2000#', amountRWF: '2,000 RWF' },
  pro: { mtn: '*182*8*1*PROFITMATE*5000#', airtel: '*185*9*1*PROFITMATE*5000#', amountRWF: '5,000 RWF' },
};

const SettingsPage = () => {
  const { state, t, setLanguage, setPlan, setCurrency, setTheme } = useApp();
  const [showUssd, setShowUssd] = useState(false);
  const [selectedPlanForUssd, setSelectedPlanForUssd] = useState<'basic' | 'pro'>('basic');

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    toast.success(t('codeCopied'));
  };

  const handleUpgradeWithUssd = (planKey: 'basic' | 'pro') => {
    setSelectedPlanForUssd(planKey);
    setShowUssd(true);
    setPlan(planKey);
  };

  const codes = ussdCodes[selectedPlanForUssd];

  const themeOptions: { key: Theme; icon: typeof Sun; label: string }[] = [
    { key: 'light', icon: Sun, label: t('lightMode') },
    { key: 'dark', icon: Moon, label: t('darkMode') },
    { key: 'system', icon: Monitor, label: t('systemMode') },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Appearance */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display">{t('appearance')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg text-sm font-medium transition-all ${
                  state.theme === key
                    ? 'gradient-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Language */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display">{t('language')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(languageNames) as Language[]).map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`p-3 rounded-lg text-sm font-medium transition-all ${
                  state.language === lang
                    ? 'gradient-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {languageNames[lang]}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Currency */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display">Currency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {currencies.map(c => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`p-3 rounded-lg text-sm font-medium transition-all ${
                  state.currency === c
                    ? 'gradient-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <div>
        <h2 className="text-xl font-display font-bold text-foreground mb-4">{t('subscription')}</h2>
        <div className="space-y-3">
          {plans.map(plan => {
            const Icon = plan.icon;
            const isActive = state.plan === plan.key;
            const planName = plan.key === 'free' ? t('freePlan') : plan.key === 'basic' ? t('basicPlan') : t('proPlan');
            return (
              <Card
                key={plan.key}
                className={`border shadow-sm transition-all ${
                  isActive ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                } ${plan.popular ? 'relative' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-2.5 left-4 px-3 py-0.5 rounded-full gradient-secondary text-xs font-bold text-secondary-foreground">
                    Popular
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="font-display font-bold text-foreground">{planName}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-display font-bold text-foreground">{plan.price}</span>
                      <span className="text-xs text-muted-foreground">{t('perMonth')}</span>
                    </div>
                  </div>
                  <ul className="space-y-1.5 mb-3">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        {t(f)}
                      </li>
                    ))}
                  </ul>
                  {plan.key === 'free' && (
                    <p className="text-xs text-primary font-medium mb-2">{t('permanentFree')}</p>
                  )}
                  {plan.key === 'free' ? (
                    <Button
                      size="sm"
                      className={`w-full ${isActive ? 'bg-muted text-foreground' : 'gradient-primary border-0 text-primary-foreground'}`}
                      disabled={isActive}
                      onClick={() => setPlan(plan.key)}
                    >
                      {isActive ? t('currentPlan') : t('upgrade')}
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        className={`w-full ${isActive ? 'bg-muted text-foreground' : 'gradient-primary border-0 text-primary-foreground'}`}
                        disabled={isActive}
                        onClick={() => handleUpgradeWithUssd(plan.key as 'basic' | 'pro')}
                      >
                        {isActive ? t('currentPlan') : t('upgrade')}
                      </Button>
                      {!isActive && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full gap-2 border-accent text-accent-foreground"
                          onClick={() => handleUpgradeWithUssd(plan.key as 'basic' | 'pro')}
                        >
                          <Phone className="w-4 h-4" />
                          {t('payWithMomo')}
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* USSD Payment Section */}
      <Card className="border-2 border-accent shadow-md overflow-hidden">
        <button
          onClick={() => setShowUssd(!showUssd)}
          className="w-full"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-accent" />
                {t('ussdPayTitle')}
              </div>
              {showUssd ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </CardTitle>
          </CardHeader>
        </button>

        {showUssd && (
          <CardContent className="pt-0 space-y-4">
            <p className="text-sm text-muted-foreground">{t('ussdPayDesc')}</p>

            {/* Plan selector */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPlanForUssd('basic')}
                className={`flex-1 p-2 rounded-lg text-sm font-medium transition-all ${
                  selectedPlanForUssd === 'basic'
                    ? 'gradient-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-foreground'
                }`}
              >
                {t('basicPlan')} — $2
              </button>
              <button
                onClick={() => setSelectedPlanForUssd('pro')}
                className={`flex-1 p-2 rounded-lg text-sm font-medium transition-all ${
                  selectedPlanForUssd === 'pro'
                    ? 'gradient-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-foreground'
                }`}
              >
                {t('proPlan')} — $5
              </button>
            </div>

            {/* MTN MoMo */}
            <div className="rounded-xl bg-[hsl(45,90%,95%)] border border-accent/30 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-accent-foreground">M</span>
                </div>
                <span className="font-display font-bold text-sm text-foreground">{t('ussdMtn')}</span>
              </div>
              <button
                onClick={() => copyCode(codes.mtn)}
                className="w-full flex items-center justify-between bg-card rounded-lg p-3 border border-border active:scale-[0.98] transition-transform"
              >
                <code className="text-base font-bold text-foreground tracking-wide">{codes.mtn}</code>
                <Copy className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </button>
              <p className="text-xs text-muted-foreground">{t('copyCode')}</p>
            </div>

            <p className="text-center text-xs text-muted-foreground font-medium">— {t('ussdOr')} —</p>

            {/* Airtel Money */}
            <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-destructive">A</span>
                </div>
                <span className="font-display font-bold text-sm text-foreground">{t('ussdAirtel')}</span>
              </div>
              <button
                onClick={() => copyCode(codes.airtel)}
                className="w-full flex items-center justify-between bg-card rounded-lg p-3 border border-border active:scale-[0.98] transition-transform"
              >
                <code className="text-base font-bold text-foreground tracking-wide">{codes.airtel}</code>
                <Copy className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </button>
              <p className="text-xs text-muted-foreground">{t('copyCode')}</p>
            </div>

            {/* Payment info */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-1">
              <p className="text-xs font-medium text-foreground">{t('ussdPayTo')}</p>
              <p className="text-xs text-muted-foreground">{t('ussdAmount')}: <span className="font-bold text-foreground">{codes.amountRWF}</span></p>
            </div>

            {/* Steps */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">{t('ussdStep1')}</p>
              <p className="text-xs text-muted-foreground">{t('ussdStep2')}</p>
              <p className="text-xs text-muted-foreground">{t('ussdStep3')}</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default SettingsPage;
