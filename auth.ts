import NextAuth from "next-auth";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import jwt from "jsonwebtoken";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [],
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL as string,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  }),
  callbacks: {
    async session({ session, user }) {
      const signingSecret = process.env.SUPABASE_JWT_SECRET;
      if (signingSecret) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: user.id,
          email: user.email,
          role: "authenticated",
        };
        session.supabaseAccessToken = jwt.sign(payload, signingSecret);
      }
      return session;
    },
  },
});
