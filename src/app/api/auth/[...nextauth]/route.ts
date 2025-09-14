import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
      return true;
    },

    async jwt({ token, account }) {
      if (account?.id_token) (token as any).idToken = account.id_token;
      return token;
    },
    async session({ session, token }) {
      (session as any).idToken = (token as any).idToken; // <- expone id_token al cliente
      return session;
    },
  },
});
export { handler as GET, handler as POST };
