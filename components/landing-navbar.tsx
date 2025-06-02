"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, Menu, X } from "lucide-react"

export default function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-100 bg-white">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-2">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-purple-800">UniVast</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-6">
            <li>
              <a href="#features" className="text-gray-600 hover:text-purple-600">
                Features
              </a>
            </li>
            <li>
              <a href="#universities" className="text-gray-600 hover:text-purple-600">
                Universities
              </a>
            </li>
            <li>
              <a href="#testimonials" className="text-gray-600 hover:text-purple-600">
                Testimonials
              </a>
            </li>
            <li>
              <a href="#faq" className="text-gray-600 hover:text-purple-600">
                FAQ
              </a>
            </li>
          </ul>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-2">
          <Link href="/auth?tab=login">
            <Button variant="ghost" className="text-purple-600 hover:bg-purple-50">
              Log In
            </Button>
          </Link>
          <Link href="/auth">
            <Button className="bg-purple-600 hover:bg-purple-700">Sign Up</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-purple-100">
          <div className="container px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <a
                href="#features"
                className="text-gray-600 hover:text-purple-600 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#universities"
                className="text-gray-600 hover:text-purple-600 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Universities
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-purple-600 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Testimonials
              </a>
              <a
                href="#faq"
                className="text-gray-600 hover:text-purple-600 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <div className="pt-2 border-t border-purple-100 flex flex-col space-y-3">
                <Link href="/auth?tab=login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-purple-600 hover:bg-purple-50">
                    Log In
                  </Button>
                </Link>
                <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700">Sign Up</Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
