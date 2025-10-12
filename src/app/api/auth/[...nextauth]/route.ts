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
