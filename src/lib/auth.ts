import bcrypt from 'bcryptjs';
import type { Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

import { query } from './db';
import { logger } from './logger';

type AuthUserRow = {
  id: number;
  email: string;
  password: string;
  name?: string | null;
  role?: string | null;
  is_active: boolean;
};

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const userQuery = `
            SELECT id, email, password, full_name AS name, role, is_active
            FROM users
            WHERE email = ? AND is_active = true
          `;
          const userResult = await query<AuthUserRow>(userQuery, [credentials.email]);

          if (userResult.rows.length === 0) {
            return null;
          }

          const user = userResult.rows[0];
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          try {
            const updateQuery = `
              UPDATE users
              SET last_login = NOW(), login_count = login_count + 1
              WHERE id = ?
            `;
            await query(updateQuery, [user.id]);
          } catch (updateError) {
            logger.error('Failed to update last login', updateError);
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name ?? undefined,
            role: user.role ?? 'user',
          };
        } catch (error) {
          logger.error('Authentication error', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: { role?: string } | null }) {
      if (user && user.role) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        // sub is present on default JWT in NextAuth v4
        const { sub } = token as JWT & { sub?: string };
        if (sub) session.user.id = sub;
        if (token.role) session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
};
