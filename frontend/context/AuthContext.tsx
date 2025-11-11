import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import { setApiToken } from '../services/apiClient';

type AuthContextType = {
  user: any;
  session: any;
  loading: boolean;
  signOut: () => Promise<void>;
  checkOnboardingStatus: () => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  checkOnboardingStatus: async () => false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkOnboardingStatus = async (): Promise<boolean> => {
    if (!session?.user) return false;
    
    const { data: userProfile } = await supabase
      .from('userProfile')
      .select('id')
      .eq('id', session.user.id)
      .maybeSingle();

    return !!userProfile;
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setApiToken(session?.access_token);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setApiToken(session?.access_token);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setApiToken(undefined);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        loading, 
        signOut, 
        checkOnboardingStatus 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};