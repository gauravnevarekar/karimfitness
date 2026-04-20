import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useSession() {
  const [state, setState] = useState({ loading: true, session: null, profile: null });

  useEffect(() => {
    const bootstrap = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setState({ loading: false, session: null, profile: null });
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionData.session.user.id)
        .single();
      setState({ loading: false, session: sessionData.session, profile });
    };

    bootstrap();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        setState({ loading: false, session: null, profile: null });
        return;
      }
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setState({ loading: false, session, profile });
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return state;
}
