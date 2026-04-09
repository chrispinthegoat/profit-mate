import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        toast.success('Welcome back! 👋');
      } else {
        const { error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) throw error;
        toast.success('Account created! Check your email to confirm.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
            <span className="text-primary-foreground font-display font-extrabold text-2xl">P</span>
          </div>
          <h1 className="text-2xl font-display font-extrabold text-foreground">ProfitMate</h1>
          <p className="text-sm text-muted-foreground text-center">
            {isLogin ? 'Welcome back! Sign in to your account' : 'Create an account to get started'}
          </p>
        </div>

        {/* Auth Card */}
        <Card className="border-border/50 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-display">
              {isLogin ? 'Sign In' : 'Create Account'}
            </CardTitle>
            <CardDescription>
              {isLogin ? 'Enter your email and password' : 'Fill in your details below'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                {loading ? (
                  <span className="animate-pulse">Please wait...</span>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline font-medium"
              >
                {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
              </button>
            </div>

            {/* Skip / Continue without account */}
            <div className="mt-3 text-center">
              <a
                href="/"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Continue without an account →
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
