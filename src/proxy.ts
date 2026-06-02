import { auth } from "@/auth"
import { NextResponse } from "next/server"

const handler = auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")
  const isApiAuth  = pathname.startsWith("/api/auth")

  if (isApiAuth)                        return NextResponse.next()
  if (isAuthPage && isLoggedIn)         return NextResponse.redirect(new URL("/", req.url))
  if (!isAuthPage && !isLoggedIn)       return NextResponse.redirect(new URL("/sign-in", req.url))

  return NextResponse.next()
})

// Next.js 16 requires a named "proxy" export; default export kept for compatibility
export const proxy = handler
export default handler

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
}
