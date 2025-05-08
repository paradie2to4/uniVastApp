"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Bookmark, UserCheck, Search, GraduationCap, School, MapPin, BookOpen } from "lucide-react"
import DashboardSidebar from "@/components/dashboard-sidebar"
import DashboardHeader from "@/components/dashboard-header"
import type { Program } from "@/app/api/programs/route"
import { type Application, ApplicationStatus } from "@/app/api/applications/route"
import ApplicationForm from "@/components/application-form"
import { useSearchParams } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// Update Program type to make university optional
interface ProgramWithOptionalUniversity extends Omit<Program, 'university'> {
  university?: {
    id: number
    name: string
    location: string
  }
}

export default function StudentDashboard() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") || "dashboard"

  const [activeTab, setActiveTab] = useState(initialTab)
  const [userData, setUserData] = useState({
    id: 1,
    firstName: "Student",
    lastName: "",
    email: "student@example.com",
    profilePicture: "/placeholder.svg?height=40&width=40",
    isNewUser: false,
  })
  const [programs, setPrograms] = useState<ProgramWithOptionalUniversity[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [featuredUniversities, setFeaturedUniversities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProgram, setSelectedProgram] = useState<ProgramWithOptionalUniversity | null>(null)
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [programFilter, setProgramFilter] = useState("")
  const [universityFilter, setUniversityFilter] = useState("")
  const [degreeFilter, setDegreeFilter] = useState("")

  // Load user data from localStorage on component mount
  useEffect(() => {
    // This code only runs on the client side
    const storedUserData = localStorage.getItem("univast_user")
    if (storedUserData) {
      try {
        const user = JSON.parse(storedUserData)
        setUserData({
          id: user.id || 1,
          firstName: user.firstName || "Student",
          lastName: user.lastName || "",
          email: user.email || "student@example.com",
          profilePicture: user.profilePicture || "/placeholder.svg?height=40&width=40",
          isNewUser: user.isNewUser || false, // Store the isNewUser flag
        })

        // If this was a new user, update the flag to false for next login
        if (user.isNewUser) {
          localStorage.setItem(
            "univast_user",
            JSON.stringify({
              ...user,
              isNewUser: false,
            }),
          )
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }

    // Fetch programs and applications
    fetchPrograms()
    fetchApplications()
    fetchUniversities()
  }, [])

  const fetchPrograms = async () => {
    try {
      const response = await fetch("/api/programs")
      if (response.ok) {
        const data = await response.json()
        // Ensure each program has the required structure
        const validPrograms = data.map((program: any) => ({
          ...program,
          university: program.university ? {
            id: program.university.id || 0,
            name: program.university.name || 'Unknown University',
            location: program.university.location || 'Location not specified'
          } : undefined
        }))
        setPrograms(validPrograms)
      }
    } catch (error) {
      console.error("Error fetching programs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchApplications = async () => {
    try {
      const response = await fetch(`/api/applications?studentId=${userData.id}`)
      if (response.ok) {
        const data = await response.json()
        setApplications(data)
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
    }
  }

  const fetchUniversities = async () => {
    try {
      const response = await fetch("/api/universities")
      if (response.ok) {
        const data = await response.json()
        setFeaturedUniversities(data.slice(0, 4))
      }
    } catch (error) {
      console.error("Error fetching universities:", error)
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const formatDate = (date: Date | string) => {
    if (typeof date === "string") {
      date = new Date(date)
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const handleApplyClick = (program: ProgramWithOptionalUniversity) => {
    setSelectedProgram(program)
    setIsApplicationFormOpen(true)
  }

  const handleApplicationSubmitted = () => {
    setIsApplicationFormOpen(false)
    fetchApplications()
    setActiveTab("applications")
  }

  const getStatusBadgeClass = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.PENDING:
        return "bg-yellow-100 text-yellow-800"
      case ApplicationStatus.REVIEWING:
        return "bg-blue-100 text-blue-800"
      case ApplicationStatus.ACCEPTED:
        return "bg-green-100 text-green-800"
      case ApplicationStatus.REJECTED:
        return "bg-red-100 text-red-800"
      case ApplicationStatus.WITHDRAWN:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredPrograms = programs.filter((program) => {
    let matches = true

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      matches =
        matches &&
        (program.name.toLowerCase().includes(query) ||
          (program.university?.name || '').toLowerCase().includes(query) ||
          (program.description || '').toLowerCase().includes(query))
    }

    if (universityFilter && universityFilter !== "all") {
      matches = matches && (program.university?.name || '') === universityFilter
    }

    if (degreeFilter) {
      matches = matches && program.degree === degreeFilter
    }

    return matches
  })

  const sidebarItems = [
    { icon: <GraduationCap size={20} />, label: "Dashboard", tab: "dashboard" },
    { icon: <School size={20} />, label: "Universities", tab: "universities" },
    { icon: <BookOpen size={20} />, label: "Programs", tab: "programs" },
    { icon: <FileText size={20} />, label: "My Applications", tab: "applications" },
    { icon: <UserCheck size={20} />, label: "My Profile", tab: "profile" },
  ]

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar
        items={sidebarItems}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        logoIcon={<GraduationCap size={20} />}
        logoText="UniVast"
      />

      <div className="flex-1 flex flex-col">
        <DashboardHeader
          userType="Student"
          userName={`${userData.firstName} ${userData.lastName}`.trim()}
          userAvatar={userData.profilePicture}
        />

        {/* Welcome Banner - Updated with personalized name */}
        <section className="bg-gradient-to-r from-purple-50 to-white p-6 md:p-8">
          <span className="text-gray-500">
            {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-purple-800 mt-1">
            {userData.isNewUser ? `Welcome, ${userData.firstName}!` : `Welcome back, ${userData.firstName}!`}
          </h1>
          <p className="text-gray-600">Find your perfect university and program</p>
        </section>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 md:p-8">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Quick Stats */}
                <section>
                  <h2 className="text-xl font-bold text-purple-800 mb-4">Your Overview</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="border-purple-100">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Applications</p>
                          <h3 className="text-2xl font-bold text-purple-800">{applications.length}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-purple-100">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Saved Programs</p>
                          <h3 className="text-2xl font-bold text-purple-800">0</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Bookmark className="h-5 w-5 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-purple-100">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Profile Completion</p>
                          <h3 className="text-2xl font-bold text-purple-800">80%</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <UserCheck className="h-5 w-5 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Recent Applications */}
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-purple-800">Recent Applications</h2>
                    <Button
                      variant="ghost"
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-0"
                      onClick={() => setActiveTab("applications")}
                    >
                      See all
                    </Button>
                  </div>
                  <Card className="border-purple-100">
                    <CardContent className="p-4 divide-y divide-purple-100">
                      {applications.length === 0 ? (
                        <p className="text-gray-500 py-4 text-center">
                          No applications found. Start applying to programs!
                        </p>
                      ) : (
                        applications.slice(0, 3).map((app) => (
                          <div key={app.id} className="py-3 first:pt-0 last:pb-0">
                            <h3 className="font-medium text-purple-800">{app.program.name}</h3>
                            <p className="text-sm text-gray-600">
                              <strong>University:</strong> {app.program.university?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Status:</strong>{" "}
                              <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadgeClass(app.status)}`}>
                                {app.status}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Applied:</strong> {formatDate(app.submissionDate)}
                            </p>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </section>
              </div>

              {/* Featured Universities */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-purple-800">Featured Universities</h2>
                  <Button
                    variant="ghost"
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-0"
                    onClick={() => setActiveTab("universities")}
                  >
                    See all
                  </Button>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {featuredUniversities.map((university: any) => (
                    <Card key={university.id} className="border-purple-100">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-3">
                            <img
                              src={university.logo || "/placeholder.svg?height=100&width=100"}
                              alt={`${university.name} Logo`}
                              className="w-12 h-12 object-contain"
                            />
                          </div>
                          <h3 className="text-lg font-bold text-purple-800 text-center mb-1">{university.name}</h3>
                          <p className="text-sm text-gray-600 flex items-center mb-2">
                            <MapPin className="h-3 w-3 mr-1" />
                            {university.location}
                          </p>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2 text-center">
                            {university.description}
                          </p>
                          <p className="text-sm text-gray-600 mb-4">
                            <strong>Acceptance Rate:</strong> {university.acceptanceRate}%
                          </p>
                          <Button
                            className="w-full bg-purple-600 hover:bg-purple-700"
                            onClick={() => {
                              setUniversityFilter(university.name)
                              setActiveTab("programs")
                            }}
                          >
                            View Programs
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === "programs" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-800">Browse Programs</h2>

              <Card className="border-purple-100">
                <CardContent className="p-6">
                  <form className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <label htmlFor="programSearch" className="text-sm font-medium text-gray-700">
                        Search
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="programSearch"
                          placeholder="Search by name or degree"
                          className="pl-9 border-purple-100"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="universityFilter" className="text-sm font-medium text-gray-700">
                        University
                      </label>
                      <Select value={universityFilter} onValueChange={setUniversityFilter}>
                        <SelectTrigger id="universityFilter" className="border-purple-100">
                          <SelectValue placeholder="All Universities" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Universities</SelectItem>
                          {Array.from(new Set(programs
                            .filter(p => p.university?.name)
                            .map(p => p.university?.name || 'Unknown University')))
                            .map((name) => (
                              <SelectItem key={name} value={name}>
                                {name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="degreeFilter" className="text-sm font-medium text-gray-700">
                        Degree
                      </label>
                      <Select value={degreeFilter} onValueChange={setDegreeFilter}>
                        <SelectTrigger id="degreeFilter" className="border-purple-100">
                          <SelectValue placeholder="All Degrees" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Degrees</SelectItem>
                          <SelectItem value="Bachelor">Bachelor</SelectItem>
                          <SelectItem value="Master">Master</SelectItem>
                          <SelectItem value="PhD">PhD</SelectItem>
                          <SelectItem value="Juris Doctor">Juris Doctor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={() => {
                          setSearchQuery("")
                          setUniversityFilter("all")
                          setDegreeFilter("")
                        }}
                        type="button"
                      >
                        <Search className="mr-2 h-4 w-4" /> Search
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {isLoading ? (
                  <p className="text-center py-8">Loading programs...</p>
                ) : filteredPrograms.length === 0 ? (
                  <p className="text-center py-8">No programs found matching your criteria.</p>
                ) : (
                  filteredPrograms.map((program) => (
                    <Card key={program.id} className="border-purple-100">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-purple-800 mb-1">{program.name}</h3>
                            <p className="text-sm text-gray-600 mb-1">{program.university?.name}</p>
                            <p className="text-sm text-gray-600 mb-2">
                              {program.degree} • {program.duration}
                            </p>
                            <p className="text-sm text-gray-600 mb-3">{program.description}</p>
                            <p className="text-sm text-gray-600">
                              <strong>Tuition Fee:</strong> ${program.tuitionFee.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-end justify-end md:min-w-[120px]">
                            <Button
                              className="w-full md:w-auto bg-purple-600 hover:bg-purple-700"
                              onClick={() => handleApplyClick(program)}
                            >
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "applications" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-800">My Applications</h2>

              {applications.length === 0 ? (
                <Card className="border-purple-100">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 mb-4">You have not submitted any applications yet.</p>
                    <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setActiveTab("programs")}>
                      Browse Programs
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <Card key={app.id} className="border-purple-100">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-purple-800 mb-3">{app.program.name}</h3>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            <strong>University:</strong> {app.program.university?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Status:</strong>{" "}
                            <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadgeClass(app.status)}`}>
                              {app.status}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Applied:</strong> {formatDate(app.submissionDate)}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Last Updated:</strong> {formatDate(app.lastUpdated)}
                          </p>
                          <div className="mt-2">
                            <h4 className="text-sm font-medium text-gray-700">Personal Statement:</h4>
                            <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-3 rounded-md">
                              {app.personalStatement}
                            </p>
                          </div>
                          {app.feedback && (
                            <div className="mt-2">
                              <h4 className="text-sm font-medium text-gray-700">Feedback:</h4>
                              <p className="text-sm text-gray-600 mt-1 bg-blue-50 p-3 rounded-md">{app.feedback}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-800">My Profile</h2>

              <Card className="border-purple-100">
                <CardContent className="p-6">
                  <form className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="profileFirstName" className="text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <Input id="profileFirstName" defaultValue={userData.firstName} className="border-purple-100" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="profileLastName" className="text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <Input id="profileLastName" defaultValue={userData.lastName} className="border-purple-100" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="profileEmail" className="text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <Input id="profileEmail" defaultValue={userData.email} className="border-purple-100" readOnly />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="profilePicture" className="text-sm font-medium text-gray-700">
                          Profile Picture URL
                        </label>
                        <Input
                          id="profilePicture"
                          defaultValue={userData.profilePicture}
                          className="border-purple-100"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label htmlFor="profileBio" className="text-sm font-medium text-gray-700">
                          Bio
                        </label>
                        <textarea
                          id="profileBio"
                          rows={4}
                          className="w-full p-2 border border-purple-100 rounded-md"
                          placeholder="Tell us about yourself"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="profileEducation" className="text-sm font-medium text-gray-700">
                          Education
                        </label>
                        <Input id="profileEducation" placeholder="Highest Education" className="border-purple-100" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="profileGPA" className="text-sm font-medium text-gray-700">
                          GPA
                        </label>
                        <Input
                          id="profileGPA"
                          type="number"
                          placeholder="GPA"
                          min="0"
                          max="4"
                          step="0.01"
                          className="border-purple-100"
                        />
                      </div>
                    </div>
                    <Button className="w-full md:w-auto bg-purple-600 hover:bg-purple-700">Save Profile</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Application Form Dialog */}
      <Dialog open={isApplicationFormOpen} onOpenChange={setIsApplicationFormOpen}>
        <DialogContent className="sm:max-w-[800px] p-0">
          {selectedProgram && (
            <ApplicationForm
              program={selectedProgram}
              studentId={userData.id}
              studentName={`${userData.firstName} ${userData.lastName}`.trim()}
              studentEmail={userData.email}
              onSuccess={handleApplicationSubmitted}
              onCancel={() => setIsApplicationFormOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
