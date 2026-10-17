import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { decode as defaultDecode } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  trustHost: true,
  jwt: {
    // A cookie encrypted under a since-rotated/changed AUTH_SECRET (or otherwise
    // corrupted) throws JWEInvalid from the default decode instead of just
    // meaning "no session". Treat that the same as no session rather than
    // letting it surface as a noisy JWTSessionError on every request.
    async decode(params) {
      try {
        return await defaultDecode(params);
      } catch {
        return null;
      }
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  logger: {
    error(error) {
      // A leftover session cookie that no longer decrypts (rotated AUTH_SECRET,
      // corrupted value, etc.) is not a real error — Auth.js already falls back
      // to "no session" for it. Don't spam the server log with it on every request.
      if (error.name === "JWTSessionError") return;
      console.error(error);
    },
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      const allowed = await prisma.allowedEmail.findUnique({
        where: { email: user.email },
      });
      return !!allowed;
    },
    async jwt({ token, user }) {
      const email = user?.email ?? token.email;
      if (!email) return token;

      const allowed = await prisma.allowedEmail.findUnique({
        where: { email },
        include: {
          role: { include: { permissions: { include: { permission: true } } } },
        },
      });

      if (!allowed) return token;

      const dbUser = await prisma.user.upsert({
        where: { email },
        create: {
          email,
          name: user?.name,
          image: user?.image,
          roleId: allowed.roleId,
          lastLoginAt: new Date(),
        },
        update: {
          name: user?.name,
          image: user?.image,
          roleId: allowed.roleId,
          lastLoginAt: new Date(),
        },
      });

      token.userId = dbUser.id;
      token.roleName = allowed.role.name;
      token.permissions = allowed.role.permissions.map((rp) => rp.permission.key);

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.userId as string) ?? "";
        session.user.roleName = (token.roleName as string) ?? "";
        session.user.permissions = (token.permissions as string[]) ?? [];
      }
      return session;
    },
  },
});
