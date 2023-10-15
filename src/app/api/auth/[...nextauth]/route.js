import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/db/db";
import {verify} from "@/utils/password";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";

export const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            async authorize(credentials, req) {
              // FullStack NextJS - don't have separate backend
                //   1. Login the uer inside the credential providers  - Active
                //   2. Custom Login and Refresh Token API
              // Separate Backend

              const user = await prisma.user.findUnique({
                where: {
                    email: credentials.email
                }
              })
              if (!user) {
                throw new Error("User account does not exists.")
              }

              // Validation Logic for login
              if(!verify(credentials.password, user.password)) {
                throw new Error("Invalid email or password.")
              }
              return {
                name: user.name,
                email: user.email,
                id: user.id
              }
            }
          }),
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
          })
    ],
    session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
    secret: process.env.NEXTAUTH_SECRET,
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        maxAge: 60 * 60 * 24 * 30,
        encryption: true,
    },

    callbacks: {
        async signIn({ user, account}) {
          if(account?.provider === 'credentials') {
            return true;
          }

          if(user) {
            const dbUser = await prisma.user.findUnique({
              where: {
                email: user.email
              }
            })
            if(dbUser) {
              const dbAccount = await prisma.account.findUnique({
                where: {
                  provider_providerAccountId: {
                    provider: account.provider,
                    providerAccountId:account.providerAccountId 
                  }
                }
              })
              if(!dbAccount) {
                await prisma.account.create({
                  data: {
                    userId: dbUser.id,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    type: account.type,
                    token_type: account.token_type,
                    scope: account.scope,
                    access_token: account.access_token,
                    refresh_token: account.refresh_token,
                    expires_at: account.expires_at
                  }
                })
              }
            }
          }
          return true;
        },
        async session({ session, user, token }) {
          return session
        },
        async jwt({ token, user}) {
            if(user) {
                token.user = user
            }
          return token
        }
    },
    pages: {
      signIn: '/auth/login',
    }
  })
  
  export { handler as GET, handler as POST }