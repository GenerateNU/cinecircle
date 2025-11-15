import Constants from 'expo-constants';
import { createClient } from '@supabase/supabase-js';

// Use optional chaining + fallback to empty object
const extra = Constants.expoConfig?.extra ?? {};

// Optionally define a type for clarity
type ExtraConfig = {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
};


// // Optionally assert they exist if you’re sure
// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Supabase environment variables are missing!');
// }
const supabaseAnonKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14d3J5cW1rbWVpbnBna3Vlb3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjY1NjcsImV4cCI6MjA3MjUwMjU2N30.1x0F1Wsx5QG5wo73HvBGXlbmb6gfuH_Htk4Ikm47uJA'

export const supabase = createClient('https://mxwryqmkmeinpgkueopj.supabase.co', supabaseAnonKey);
