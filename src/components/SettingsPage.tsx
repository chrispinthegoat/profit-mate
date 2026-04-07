import { useApp } from '@/contexts/AppContext';
import { Language, languageNames } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

const SettingsPage = () => {
  const { state, t, setLanguage, setPlan, setCurrency } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Language */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display">{t('language')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
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
                  <Button
                    size="sm"
                    className={`w-full ${isActive ? 'bg-muted text-foreground' : 'gradient-primary border-0 text-primary-foreground'}`}
                    disabled={isActive}
                    onClick={() => setPlan(plan.key)}
                  >
                    {isActive ? t('currentPlan') : t('upgrade')}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
