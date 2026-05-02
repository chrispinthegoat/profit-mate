import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import AppShell from '@/components/AppShell';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    // Listen first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session?.user);
      if (!session?.user) {
        navigate('/auth', { replace: true });
      }
    });
    // Then check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate('/auth', { replace: true });
      } else {
        setAuthed(true);
      }
      setChecking(false);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl gradient-primary animate-pulse" />
      </div>
    );
  }

  if (!authed) return null;

  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
};

export default Index;
