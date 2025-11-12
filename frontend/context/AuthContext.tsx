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
  onboardingComplete: boolean;
  setOnboardingComplete: (complete: boolean) => void;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  onboardingComplete: false,
  setOnboardingComplete: () => {},
  signOut: async () => {},
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
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const checkOnboardingStatus = async (userId: string) => {
    const { data: userProfile } = await supabase
      .from('UserProfile')
      .select('userId')
      .eq('userId', userId)
      .maybeSingle();

    setOnboardingComplete(!!userProfile);
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setApiToken(session?.access_token);

      // Check onboarding status on initial load
      if (session?.user) {
        await checkOnboardingStatus(session.user.id);
      }

      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setApiToken(session?.access_token);

      if (!session) {
        setOnboardingComplete(false);
      } else if (session.user) {
        // Check onboarding status when auth state changes
        await checkOnboardingStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setOnboardingComplete(false);
    setApiToken(undefined);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        loading, 
        onboardingComplete,
        setOnboardingComplete,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};