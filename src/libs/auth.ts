import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthConfig } from "next-auth"
import NextAuth from 'next-auth';
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from '@/libs/prisma';
import { compareSync } from 'bcryptjs';
import GoogleProvider from "next-auth/providers/google";

const options: NextAuthConfig = {
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt", maxAge: 2 * 60 * 60 },
    pages: {
        signIn: "/login",
        error: "/login",
        signOut: "/login"
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true
        }),
        CredentialsProvider({
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: {
                        email: (credentials?.email as string),
                    },
                });

                if (!user || !(compareSync((credentials?.password as string), user.password!))) {
                    return null
                }

                return user;
            }
        })
    ],
    callbacks: {
        async signIn() {
            return true;
        }
    },
    experimental: { enableWebAuthn: true }
}

export const { handlers, auth, signIn, signOut } = NextAuth(options)