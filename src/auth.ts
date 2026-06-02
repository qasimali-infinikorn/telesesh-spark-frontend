import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${API_URL}/users/sign_in`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: { email: credentials.email, password: credentials.password },
          }),
        })

        if (!res.ok) return null

        const data = await res.json()
        const authHeader = res.headers.get("authorization")
        const token = authHeader?.replace("Bearer ", "")

        return { id: String(data.user.id), email: data.user.email, name: data.user.name, accessToken: token }
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const res = await fetch(`${API_URL}/api/v1/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token: account.id_token }),
        })

        if (!res.ok) return false

        const data = await res.json()
        const token = res.headers.get("authorization")?.replace("Bearer ", "")

        user.id = String(data.user.id)
        user.name = data.user.name
        user.email = data.user.email
        user.accessToken = token
      }
      return true
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.accessToken = user.accessToken
      }
      return token
    },

    async session({ session, token }) {
      session.user.id = token.id as string
      // @ts-expect-error — extended field
      session.accessToken = token.accessToken
      return session
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  session: { strategy: "jwt" },
})
