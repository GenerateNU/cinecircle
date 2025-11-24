import type { Request, Response } from "express";

// This is just a documentation endpoint
export const getAuthInfo = (_req: Request, res: Response) => {
  res.json({
    message: "Authentication endpoints",
    methods: {
      email_password: {
        description: "Email/password authentication via Supabase client",
        methods: ["signUp", "signInWithPassword"]
      },
      phone_whatsapp: {
        description: "Phone authentication with WhatsApp OTP via Supabase client + Twilio Verify",
        methods: ["signInWithOtp", "verifyOtp"],
        note: "OTP is sent via WhatsApp channel configured in Supabase"
      }
    }
  });
};

