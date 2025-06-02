import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "University Application System",
  description: "A modern university application management system",
  generator: 'v0.dev'
=======
  title: "UniVast - University Application Platform",
  description: "A platform for university applications and program management",
>>>>>>> 47f4fab (Updated with new features)
}

export default function RootLayout({
  children,
<<<<<<< HEAD
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
=======
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
>>>>>>> 47f4fab (Updated with new features)
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
