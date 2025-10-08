import Constants from 'expo-constants';
import { createClient } from '@supabase/supabase-js';

// Use optional chaining + fallback to empty object
const extra = Constants.expoConfig?.extra ?? {};

// Optionally define a type for clarity
type ExtraConfig = {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
};

const { supabaseUrl, supabaseAnonKey } = extra as ExtraConfig;

// Optionally assert they exist if you’re sure
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
