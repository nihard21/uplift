import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "UpLift - Your AI Journal Companion",
  description:
    "Reflect on your thoughts and feelings with AI-powered insights for emotional wellness and personal growth",
  generator: "UpLift Journal App",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
        <style>{`
html {
  font-family: 'Roboto', sans-serif;
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
