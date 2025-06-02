import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Search, PlusCircle, Filter, ArrowUpDown } from "lucide-react"
import Navbar from "@/components/navbar"

export default function ApplicationsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-purple-800">Applications</h1>
            <p className="text-gray-600">Manage and track your university applications</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/applications/new">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Application
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Search applications..." className="w-full pl-8 border-purple-100" />
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] border-purple-100">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
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

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-purple-50">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-purple-800">
              All
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:text-purple-800">
              Pending
            </TabsTrigger>
            <TabsTrigger value="accepted" className="data-[state=active]:bg-white data-[state=active]:text-purple-800">
              Accepted
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-white data-[state=active]:text-purple-800">
              Rejected
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <Card className="border-purple-100">
              <CardHeader>
                <CardTitle className="text-purple-800">All Applications</CardTitle>
                <CardDescription>View and manage all your applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-purple-100">
                  <div className="grid grid-cols-6 bg-purple-50 p-4 text-sm font-medium text-gray-600">
                    <div>University</div>
                    <div>Program</div>
                    <div>Deadline</div>
                    <div>Submitted</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                  <div className="grid grid-cols-6 items-center p-4 text-sm border-t border-purple-100">
                    <div className="font-medium">Harvard University</div>
                    <div>Computer Science</div>
                    <div>Jan 1, 2024</div>
                    <div>Dec 15, 2023</div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Pending
                      </span>
                    </div>
                    <div className="text-right">
                      <Link href="/applications/1">
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
                    <div className="font-medium">Stanford University</div>
                    <div>Business Administration</div>
                    <div>Dec 1, 2023</div>
                    <div>Nov 20, 2023</div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Accepted
                      </span>
                    </div>
                    <div className="text-right">
                      <Link href="/applications/2">
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
                    <div className="font-medium">MIT</div>
                    <div>Electrical Engineering</div>
                    <div>Dec 15, 2023</div>
                    <div>Dec 1, 2023</div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Accepted
                      </span>
                    </div>
                    <div className="text-right">
                      <Link href="/applications/3">
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
                    <div className="font-medium">Yale University</div>
                    <div>Psychology</div>
                    <div>Jan 2, 2024</div>
                    <div>Dec 20, 2023</div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Pending
                      </span>
                    </div>
                    <div className="text-right">
                      <Link href="/applications/4">
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
                    <div className="font-medium">Princeton University</div>
                    <div>Mathematics</div>
                    <div>Dec 31, 2023</div>
                    <div>Dec 15, 2023</div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        Rejected
                      </span>
                    </div>
                    <div className="text-right">
                      <Link href="/applications/5">
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
          </TabsContent>
          {/* Other tab contents would be similar but filtered by status */}
        </Tabs>
      </main>
    </div>
  )
}
