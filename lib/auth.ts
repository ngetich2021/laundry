import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
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
