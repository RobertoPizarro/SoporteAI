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
      const allowedDomains = process.env.ALLOWED_EMAIL_DOMAINS?.split(",").map(d => d.trim());
      const allowedEmails = process.env.ALLOWED_EMAILS?.split(",").map(e => e.trim());
      const email = profile?.email || "";
      // Permitir si el email está en la lista de permitidos
      if (allowedEmails && allowedEmails.includes(email)) return true;
      // Permitir si el dominio está en la lista de permitidos
      if (
        allowedDomains &&
        allowedDomains.some(domain => email.endsWith("@" + domain))
      ) {
        return true;
      }
      // Denegar en cualquier otro caso
      return false;
    },
  },
  // ...otros settings
});

export { handler as GET, handler as POST };