import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import "../styles/carousel.css"

export const metadata: Metadata = {
  title: "Azkaban Idhas - Clan Oficial",
  description: "Clan Azkaban - Servidor Idhas, Priston Tale Brasil. Lealdade não se compra!",
  generator: "azkaban-clan",
  icons: {
    icon: "/images/azkaban-logo.png",
    shortcut: "/images/azkaban-logo.png",
    apple: "/images/azkaban-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="keywords" content="Azkaban, Clan, Priston Tale, Idhas, PvP, MMORPG, Brasil" />
        <meta name="author" content="Clan Azkaban" />
        <meta property="og:title" content="Azkaban Idhas - Clan Oficial" />
        <meta property="og:description" content="Clan Azkaban - Servidor Idhas, Priston Tale Brasil. Lealdade não se compra!" />
        <meta property="og:image" content="/images/azkaban-logo.png" />
        <meta property="og:type" content="website" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
