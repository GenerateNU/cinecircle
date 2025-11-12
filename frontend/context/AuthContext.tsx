import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import { setApiToken } from '../services/apiClient';
import { getUserProfileBasic } from '../services';

type AuthContextType = {
  user: any;
  session: any;
  loading: boolean;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string, token: string) => {
    try {
      const profileData = await getUserProfile(userId, token);
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setProfile(null);
    }
  };


  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setApiToken(session?.access_token);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setApiToken(session?.access_token);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user?.id && session?.access_token) {
      await fetchProfile(user.id, session.access_token);
    }
  };

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};