import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email Address", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          // Attempt to find the user in PostgreSQL via Prisma
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.passwordHash) {
            return null;
          }

          // Verify the password
          const isValid = await bcrypt.compare(password, user.passwordHash);

          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (dbError) {
          console.warn("Database credentials check failed or offline. Applying sandbox fallback.", dbError);

          // Zero-Config Sandbox Mode Fallbacks
          if (email === "admin@westelm.in" && password === "admin123") {
            return {
              id: "mock-admin-id-12345",
              email: "admin@westelm.in",
              name: "Admin Manager",
              role: "ADMIN",
            };
          }

          if (email === "user@westelm.in" && password === "user123") {
            return {
              id: "mock-user-id-54321",
              email: "user@westelm.in",
              name: "Luxury Customer",
              role: "USER",
            };
          }

          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "USER";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = (token.role as string) || "USER";
        (session.user as any).id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "sandboxed-secret-signing-key-12345",
  session: {
    strategy: "jwt",
  }
});
