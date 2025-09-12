import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { upsertUserWithGoogleIdToken } from "@/services/auth.service";
import { API_CONFIG } from "@/services/api.config";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      const email = profile?.email || "";

      // --- 1) Whitelist rápida en NextAuth ---
      const allowedDomains = process.env.ALLOWED_EMAIL_DOMAINS?.split(",")
        .map((d) => d.trim())
        .filter(Boolean);
      const allowedEmails = process.env.ALLOWED_EMAILS?.split(",")
        .map((e) => e.trim())
        .filter(Boolean);

      const emailAllowed =
        (allowedEmails && allowedEmails.includes(email)) ||
        (allowedDomains &&
          allowedDomains.some((domain) => email.endsWith("@" + domain)));

      if (!emailAllowed) {
        return false;
      }

      // opcional: exigir email verificado si Google lo envía
      // @ts-ignore
      if (profile?.email_verified === false) {
        return false;
      }

      // --- 2) Delegar al backend (upsert + verificación dura) ---
      const idToken = account?.id_token;
      if (!idToken) {
        return false;
      }
      
      try {
        const data = await upsertUserWithGoogleIdToken({ idToken });
        (account as any).__backendUser = {
          userId: data?.user_id,
          isNewUser: data?.is_new,
        };
        return true;
      } catch (error) {
        // Si el backend rechaza (incluye whitelist), se bloquea el login
        return false;
      }
    },

    async jwt({ token, account }) {
      if (account && (account as any).__backendUser) {
        token.userId = (account as any).__backendUser.userId;
        token.isNewUser = (account as any).__backendUser.isNewUser;
      }
      return token;
    },

    async session({ session, token }) {
      (session as any).userId = (token as any).userId;
      (session as any).isNewUser = (token as any).isNewUser;
      return session;
    },
  },
  // opcional: páginas personalizadas
  // pages: { signIn: "/login", error: "/login?error=AccessDenied" },
});

export { handler as GET, handler as POST };
