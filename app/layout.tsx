import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Cairo } from "next/font/google"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "world heart hotel",
  description: "World Heart Hotel Where the Elite Belong",
  generator: "ahmed ali",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cairo.className}>
      <body>{children}</body>
    </html>
  )
}
