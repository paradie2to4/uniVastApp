"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Menu, X, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-100 bg-white">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold text-purple-800">UniApp</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/dashboard" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>Dashboard</NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-600 hover:text-purple-600">
                    Students
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-50 to-purple-100 p-6 no-underline outline-none focus:shadow-md"
                            href="/students"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium text-purple-800">Student Management</div>
                            <p className="text-sm leading-tight text-gray-600">
                              Manage student profiles, applications, and academic records
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/students/new" title="Add Student">
                        Register new students in the system
                      </ListItem>
                      <ListItem href="/students/search" title="Search Students">
                        Find and manage existing student records
                      </ListItem>
                      <ListItem href="/students/reports" title="Student Reports">
                        Generate reports on student performance
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-600 hover:text-purple-600">
                    Universities
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                      <ListItem href="/universities" title="Browse Universities">
                        Explore partner universities and their programs
                      </ListItem>
                      <ListItem href="/universities/applications" title="University Applications">
                        Track applications to different universities
                      </ListItem>
                      <ListItem href="/universities/deadlines" title="Application Deadlines">
                        Stay updated with important application deadlines
                      </ListItem>
                      <ListItem href="/universities/requirements" title="Requirements">
                        View admission requirements for different programs
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-600 hover:text-purple-600">
                    Applications
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                      <ListItem href="/applications/new" title="New Application">
                        Start a new university application
                      </ListItem>
                      <ListItem href="/applications/status" title="Application Status">
                        Check the status of your applications
                      </ListItem>
                      <ListItem href="/applications/documents" title="Required Documents">
                        Manage documents required for applications
                      </ListItem>
                      <ListItem href="/applications/history" title="Application History">
                        View past applications and their outcomes
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-600 hover:text-purple-600">
                    Programs
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                      <ListItem href="/programs" title="Browse Programs">
                        Explore available academic programs
                      </ListItem>
                      <ListItem href="/programs/compare" title="Compare Programs">
                        Compare different programs side by side
                      </ListItem>
                      <ListItem href="/programs/requirements" title="Program Requirements">
                        View admission requirements for programs
                      </ListItem>
                      <ListItem href="/programs/popular" title="Popular Programs">
                        Discover trending and popular programs
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full border-purple-200">
                  <User className="h-5 w-5 text-purple-600" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/admin">Admin Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/logout">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Mobile Menu Button */}
          <Button variant="ghost" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              href="/dashboard"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/students"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Students
            </Link>
            <Link
              href="/universities"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Universities
            </Link>
            <Link
              href="/applications"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Applications
            </Link>
            <Link
              href="/programs"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Programs
            </Link>
            <div className="pt-4 pb-3 border-t border-purple-100">
              <Link
                href="/profile"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/settings"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </Link>
              <Link
                href="/logout"
                className="block rounded-md px-3 py-2 text-base font-medium text-purple-600 hover:bg-purple-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a"> & { title: string }>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-purple-50 hover:text-purple-600 focus:bg-purple-50 focus:text-purple-600",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none text-purple-800">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-gray-600">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"
