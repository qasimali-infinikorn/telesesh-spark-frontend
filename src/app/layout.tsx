import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import { AuthSessionProvider } from "@/providers/session-provider"
import "./globals.css"

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "Telesesh Spark",
  description: "Bright, playful therapy resources — ready for every session.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={nunito.variable} style={{ height: "100%" }}>
      <body style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  )
}
