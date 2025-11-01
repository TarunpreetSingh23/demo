import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { connects } from "@/dbconfig/dbconfig"
import User from "@/models/usermodel"
import bcrypt from "bcryptjs"

const authHandler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials

        await connects()
        const user = await User.findOne({ email })
        if (!user) return null

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) return null

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("🔑 JWT callback → user found:", user)
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        console.log("📦 Session callback → token:", token)
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
        }
      }
      return session
    },
  },
})

export { authHandler as GET, authHandler as POST }
