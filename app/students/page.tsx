import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Search, PlusCircle, Filter, ArrowUpDown } from "lucide-react"
import Navbar from "@/components/navbar"

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-purple-800">Students</h1>
            <p className="text-gray-600">Manage and track student information</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/students/new">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Search students..." className="w-full pl-8 border-purple-100" />
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] border-purple-100">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="graduated">Graduated</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-purple-100">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="border-purple-100">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </div>
        </div>

        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="text-purple-800">Student Directory</CardTitle>
            <CardDescription>View and manage all students in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-purple-100">
              <div className="grid grid-cols-6 bg-purple-50 p-4 text-sm font-medium text-gray-600">
                <div>Name</div>
                <div>Email</div>
                <div>University</div>
                <div>Program</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>
              <div className="grid grid-cols-6 items-center p-4 text-sm border-t border-purple-100">
                <div className="font-medium">John Doe</div>
                <div>john.doe@example.com</div>
                <div>Harvard University</div>
                <div>Computer Science</div>
                <div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Active
                  </span>
                </div>
                <div className="text-right">
                  <Link href="/students/1">
                    <Button variant="ghost" className="h-8 w-8 p-0 text-purple-600 hover:bg-purple-50">
                      <span className="sr-only">View</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-6 items-center p-4 text-sm border-t border-purple-100">
                <div className="font-medium">Jane Smith</div>
                <div>jane.smith@example.com</div>
                <div>Stanford University</div>
                <div>Business Administration</div>
                <div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Active
                  </span>
                </div>
                <div className="text-right">
                  <Link href="/students/2">
                    <Button variant="ghost" className="h-8 w-8 p-0 text-purple-600 hover:bg-purple-50">
                      <span className="sr-only">View</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-6 items-center p-4 text-sm border-t border-purple-100">
                <div className="font-medium">Michael Johnson</div>
                <div>michael.j@example.com</div>
                <div>MIT</div>
                <div>Electrical Engineering</div>
                <div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Active
                  </span>
                </div>
                <div className="text-right">
                  <Link href="/students/3">
                    <Button variant="ghost" className="h-8 w-8 p-0 text-purple-600 hover:bg-purple-50">
                      <span className="sr-only">View</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-6 items-center p-4 text-sm border-t border-purple-100">
                <div className="font-medium">Emily Davis</div>
                <div>emily.d@example.com</div>
                <div>Yale University</div>
                <div>Psychology</div>
                <div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Active
                  </span>
                </div>
                <div className="text-right">
                  <Link href="/students/4">
                    <Button variant="ghost" className="h-8 w-8 p-0 text-purple-600 hover:bg-purple-50">
                      <span className="sr-only">View</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-6 items-center p-4 text-sm border-t border-purple-100">
                <div className="font-medium">Robert Wilson</div>
                <div>robert.w@example.com</div>
                <div>Princeton University</div>
                <div>Mathematics</div>
                <div>
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    Inactive
                  </span>
                </div>
                <div className="text-right">
                  <Link href="/students/5">
                    <Button variant="ghost" className="h-8 w-8 p-0 text-purple-600 hover:bg-purple-50">
                      <span className="sr-only">View</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end space-x-2">
              <Button variant="outline" size="sm" className="border-purple-100">
                Previous
              </Button>
              <Button variant="outline" size="sm" className="border-purple-100 bg-purple-50">
                1
              </Button>
              <Button variant="outline" size="sm" className="border-purple-100">
                2
              </Button>
              <Button variant="outline" size="sm" className="border-purple-100">
                3
              </Button>
              <Button variant="outline" size="sm" className="border-purple-100">
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
