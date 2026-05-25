import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      isAdmin: boolean
      onboarded: boolean
    }
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const apiBase = process.env.API_SERVER_URL || 'https://api.sovdigitalgroup.com'
        const res = await fetch(`${apiBase}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        })

        if (!res.ok) return null

        const data = await res.json()
        if (!data.user) return null

        let dbUser = await prisma.user.findUnique({
          where: { email: data.user.email },
        })

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email: data.user.email,
              name: data.user.full_name || data.user.name,
              phone: data.user.phone,
            },
          })
        }

        return {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          image: dbUser.image,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { id: true, isAdmin: true, onboarded: true },
      })

      session.user.id = user.id
      session.user.isAdmin = dbUser?.isAdmin ?? false
      session.user.onboarded = dbUser?.onboarded ?? false

      return session
    },
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
        })
        if (!existing) {
          return true
        }
      }
      return true
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
})
