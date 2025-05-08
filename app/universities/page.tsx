import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Search, PlusCircle, MapPin, BookOpen, Users } from "lucide-react"
import Navbar from "@/components/navbar"

export default function UniversitiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-purple-800">Universities</h1>
            <p className="text-gray-600">Browse and explore partner universities</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/universities/new">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add University
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative flex mb-8">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input type="search" placeholder="Search universities..." className="w-full pl-8 border-purple-100" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-purple-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-purple-800">Harvard University</CardTitle>
              <CardDescription className="flex items-center">
                <MapPin className="mr-1 h-3 w-3" /> Cambridge, Massachusetts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">125 Programs</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">1,245 Applications</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Harvard University is a private Ivy League research university in Cambridge, Massachusetts.
                </p>
                <div className="flex justify-between">
                  <Link href="/universities/1">
                    <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                      View Details
                    </Button>
                  </Link>
                  <Link href="/universities/1/programs">
                    <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                      Browse Programs
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-purple-800">Stanford University</CardTitle>
              <CardDescription className="flex items-center">
                <MapPin className="mr-1 h-3 w-3" /> Stanford, California
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">118 Programs</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">1,120 Applications</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Stanford University is a private research university in Stanford, California.
                </p>
                <div className="flex justify-between">
                  <Link href="/universities/2">
                    <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                      View Details
                    </Button>
                  </Link>
                  <Link href="/universities/2/programs">
                    <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                      Browse Programs
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-purple-800">MIT</CardTitle>
              <CardDescription className="flex items-center">
                <MapPin className="mr-1 h-3 w-3" /> Cambridge, Massachusetts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">95 Programs</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">980 Applications</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  The Massachusetts Institute of Technology is a private research university in Cambridge,
                  Massachusetts.
                </p>
                <div className="flex justify-between">
                  <Link href="/universities/3">
                    <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                      View Details
                    </Button>
                  </Link>
                  <Link href="/universities/3/programs">
                    <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                      Browse Programs
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-purple-800">Yale University</CardTitle>
              <CardDescription className="flex items-center">
                <MapPin className="mr-1 h-3 w-3" /> New Haven, Connecticut
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">85 Programs</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">875 Applications</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Yale University is a private Ivy League research university in New Haven, Connecticut.
                </p>
                <div className="flex justify-between">
                  <Link href="/universities/4">
                    <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                      View Details
                    </Button>
                  </Link>
                  <Link href="/universities/4/programs">
                    <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                      Browse Programs
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-purple-800">Princeton University</CardTitle>
              <CardDescription className="flex items-center">
                <MapPin className="mr-1 h-3 w-3" /> Princeton, New Jersey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">78 Programs</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">820 Applications</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Princeton University is a private Ivy League research university in Princeton, New Jersey.
                </p>
                <div className="flex justify-between">
                  <Link href="/universities/5">
                    <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                      View Details
                    </Button>
                  </Link>
                  <Link href="/universities/5/programs">
                    <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                      Browse Programs
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-purple-800">Columbia University</CardTitle>
              <CardDescription className="flex items-center">
                <MapPin className="mr-1 h-3 w-3" /> New York City, New York
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">92 Programs</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">780 Applications</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Columbia University is a private Ivy League research university in New York City.
                </p>
                <div className="flex justify-between">
                  <Link href="/universities/6">
                    <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                      View Details
                    </Button>
                  </Link>
                  <Link href="/universities/6/programs">
                    <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                      Browse Programs
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex items-center justify-center space-x-2">
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
      </main>
    </div>
  )
}
