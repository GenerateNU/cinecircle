import dotenv from "dotenv";
dotenv.config();

const requiredEnv = ['DATABASE_URL', 'DIRECT_URL', 'PORT', 'SUPABASE_JWT_SECRET', 'SUPABASE_URL'];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

export const PORT = process.env.PORT!;
export const DATABASE_URL = process.env.DATABASE_URL!;
export const DIRECT_URL = process.env.DIRECT_URL!;
export const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET!;
export const SUPABASE_URL = process.env.SUPABASE_URL!;
