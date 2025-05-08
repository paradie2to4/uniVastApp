"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Search,
  University,
  BookOpen,
  User,
  Settings,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ShieldAlert,
} from "lucide-react"
import DashboardSidebar from "@/components/dashboard-sidebar"
import DashboardHeader from "@/components/dashboard-header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { adminApi, AdminStats, Student, University as UniversityType, Program } from "@/lib/api/admin"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: number } | null>(null)
  const [adminData, setAdminData] = useState({
    name: "Admin",
    profilePicture: "/placeholder.svg?height=40&width=40",
  })
  const [stats, setStats] = useState<AdminStats>({
    totalStudents: 0,
    totalUniversities: 0,
    totalApplications: 0,
    pendingApplications: 0,
  })
  const [students, setStudents] = useState<Student[]>([])
  const [universities, setUniversities] = useState<UniversityType[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"students" | "universities" | "programs">("students")
  const [searchResults, setSearchResults] = useState<Student[] | UniversityType[] | Program[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [settings, setSettings] = useState({
    platformName: "UniVast",
    contactEmail: "admin@univast.com",
    maintenanceMode: false,
    maintenanceMessage: "The platform is currently under maintenance. Please try again later."
  })
  const [user, setUser] = useState<any>(null);

  // Load admin data and stats from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load admin data from localStorage
    const storedUserData = localStorage.getItem("univast_user")
    if (storedUserData) {
        const user = JSON.parse(storedUserData)
        if (user.role === "ADMIN") {
          setAdminData({
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Admin",
            profilePicture: user.profilePicture || "/placeholder.svg?height=40&width=40",
          })
        }
        }

        // Load stats from backend
        const statsData = await adminApi.getStats()
        setStats(statsData)
      } catch (error) {
        console.error("Error loading admin data:", error)
        setError("Failed to load admin data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    const storedUser = localStorage.getItem("univast_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    setError(null)
    try {
      let results
      switch (searchType) {
        case "students":
          results = await adminApi.searchStudents(query)
          break
        case "universities":
          results = await adminApi.searchUniversities(query)
          break
        case "programs":
          results = await adminApi.searchPrograms(query)
          break
      }
      setSearchResults(results)
    } catch (error) {
      console.error("Error performing search:", error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unexpected error occurred while searching. Please try again.")
      }
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Debounce search function
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, searchType])

  // Mock data for stats, activities, universities, etc.
  const statsCards = [
    {
      title: "Total Universities",
      value: stats.totalUniversities,
      icon: <University className="h-6 w-6" />,
      description: "Registered universities",
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: <User className="h-6 w-6" />,
      description: "Registered students",
    },
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: <FileText className="h-6 w-6" />,
      description: "Total applications received",
    },
    {
      title: "Pending Applications",
      value: stats.pendingApplications,
      icon: <FileText className="h-6 w-6" />,
      description: "Applications awaiting review",
    },
  ]

  // Mock data that would come from the backend
  const activities = [
    {
      id: 1,
      type: "UNIVERSITY",
      description: "Harvard University updated their profile",
      timestamp: new Date("2023-01-05T14:30:00"),
    },
    {
      id: 2,
      type: "STUDENT",
      description: "New student John Doe registered",
      timestamp: new Date("2023-01-04T10:15:00"),
    },
    {
      id: 3,
      type: "PROGRAM",
      description: "New program 'Data Science' added by MIT",
      timestamp: new Date("2023-01-03T16:45:00"),
    },
    {
      id: 4,
      type: "APPLICATION",
      description: "Application #1234 status changed to ACCEPTED",
      timestamp: new Date("2023-01-02T09:20:00"),
    },
  ]

  const sidebarItems = [
    { icon: <ShieldAlert size={20} />, label: "Dashboard", tab: "dashboard" },
    { icon: <University size={20} />, label: "Universities", tab: "universities" },
    { icon: <User size={20} />, label: "Students", tab: "students" },
    { icon: <BookOpen size={20} />, label: "Programs", tab: "programs" },
    { icon: <Settings size={20} />, label: "Settings", tab: "settings" },
  ]

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const formatDateTime = (date: Date) => {
    return (
      date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
      " " +
      date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    )
  }

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar
        items={sidebarItems}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        logoIcon={<ShieldAlert size={20} />}
        logoText="UniVast"
      />

      <div className="flex-1 flex flex-col">
        <DashboardHeader userType="Administrator" userName={adminData.name} userAvatar={adminData.profilePicture} />

        {/* Welcome Banner - Updated with personalized admin name */}
        <section className="bg-gradient-to-r from-purple-50 to-white p-6 md:p-8">
          <span className="text-gray-500">
            {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-purple-800 mt-1">Welcome, {adminData.name}!</h1>
          <p className="text-gray-600">View and manage the educational platform</p>
        </section>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 md:p-8">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ShieldAlert className="h-5 w-5 text-red-400" />
                        </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                        </div>
          ) : (
            <div className="space-y-6">
              {/* Search Section */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4">
                      <Select
                        value={searchType}
                        onValueChange={(value) => setSearchType(value as "students" | "universities" | "programs")}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="students">Students</SelectItem>
                          <SelectItem value="universities">Universities</SelectItem>
                          <SelectItem value="programs">Programs</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex-1">
                        <Input
                          placeholder={`Search ${searchType}...`}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>
                        </div>
                      </CardContent>
                    </Card>

              {/* Search Results */}
              {searchQuery && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">Search Results</h3>
                    {isSearching ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : searchResults.length > 0 ? (
                      <div className="space-y-4">
                        {searchType === "students" && (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Education</TableHead>
                                <TableHead>Applications</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(searchResults as Student[]).map((student) => (
                                <TableRow key={student.id}>
                                  <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                                  <TableCell>{student.email}</TableCell>
                                  <TableCell>{student.education}</TableCell>
                                  <TableCell>{student.applicationsCount}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}

                        {searchType === "universities" && (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Programs</TableHead>
                                <TableHead>Students</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(searchResults as UniversityType[]).map((university) => (
                                <TableRow key={university.id}>
                                  <TableCell>{university.name}</TableCell>
                                  <TableCell>{university.location}</TableCell>
                                  <TableCell>{university.programsCount}</TableCell>
                                  <TableCell>{university.studentsCount}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}

                        {searchType === "programs" && (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>University</TableHead>
                                <TableHead>Degree</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Applications</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(searchResults as Program[]).map((program) => (
                                <TableRow key={program.id}>
                                  <TableCell>{program.name}</TableCell>
                                  <TableCell>{program.university?.name || 'Unknown University'}</TableCell>
                                  <TableCell>{program.degree || 'No Degree'}</TableCell>
                                  <TableCell>{program.duration || 'Duration not specified'}</TableCell>
                                  <TableCell>{program.applicationCount || 0}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                        </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        No results found
                      </div>
                    )}
                      </CardContent>
                    </Card>
              )}

              <div className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Quick Stats */}
                  <section>
                    <h2 className="text-xl font-bold text-purple-800 mb-4">Platform Overview</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {statsCards.map((card) => (
                        <Card key={card.title} className="border-purple-100">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                              <p className="text-sm text-gray-500">{card.description}</p>
                              <h3 className="text-2xl font-bold text-purple-800">{card.value}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                              {card.icon}
                        </div>
                      </CardContent>
                    </Card>
                      ))}
                  </div>
                </section>

                {/* Recent Activity */}
                <section>
                  <h2 className="text-xl font-bold text-purple-800 mb-4">Recent Activity</h2>
                  <Card className="border-purple-100">
                    <CardContent className="p-4 divide-y divide-purple-100">
                      {activities.length === 0 ? (
                        <p className="text-gray-500 py-4 text-center">No recent activity found.</p>
                      ) : (
                        activities.map((activity) => (
                          <div key={activity.id} className="py-3 first:pt-0 last:pb-0 flex gap-3">
                            <div className="flex-shrink-0">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center
                                ${activity.type === "UNIVERSITY" ? "bg-blue-100" : ""}
                                ${activity.type === "STUDENT" ? "bg-green-100" : ""}
                                ${activity.type === "PROGRAM" ? "bg-yellow-100" : ""}
                                ${activity.type === "APPLICATION" ? "bg-purple-100" : ""}
                              `}
                              >
                                {activity.type === "UNIVERSITY" && <University className="h-4 w-4 text-blue-600" />}
                                {activity.type === "STUDENT" && <User className="h-4 w-4 text-green-600" />}
                                {activity.type === "PROGRAM" && <BookOpen className="h-4 w-4 text-yellow-600" />}
                                {activity.type === "APPLICATION" && <FileText className="h-4 w-4 text-purple-600" />}
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-600">{activity.description}</p>
                              <span className="text-xs text-gray-500">{formatDateTime(activity.timestamp)}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </section>
              </div>

              {/* Universities Overview */}
              <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-purple-800"></h2>
                  <Button
                    variant="ghost"
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-0"
                    onClick={() => setActiveTab("universities")}
                  >
                    See all
                  </Button>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {universities && universities.length > 0 ? (
                      universities.map((university) => (
                    <Card key={university.id} className="border-purple-100">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-3">
                            <img
                              src={university.logo || "/placeholder.svg"}
                                  alt={`${university.name || 'University'} Logo`}
                              className="w-12 h-12 object-contain"
                            />
                          </div>
                              <h3 className="text-lg font-bold text-purple-800 text-center mb-1">
                                {university.name || 'Unnamed University'}
                              </h3>
                              <p className="text-sm text-gray-600 mb-3 text-center">
                                {university.location || 'Location not specified'}
                              </p>
                          <p className="text-sm text-gray-600 mb-1">
                                <strong>Programs:</strong> {university.programsCount || 0}
                          </p>
                          <p className="text-sm text-gray-600 mb-3">
                                <strong>Students:</strong> {university.studentsCount || 0}
                          </p>
                          <Button className="w-full bg-purple-600 hover:bg-purple-700">Manage</Button>
                        </div>
                      </CardContent>
                    </Card>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <p className="text-gray-500">No universities found</p>
                      </div>
                    )}
                </div>
              </section>
            </div>

          {activeTab === "universities" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-purple-800">Universities Overview</h2>
              </div>

              <Card className="border-purple-100">
                <CardContent className="p-6">
                      <form className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="universitySearch" className="text-sm font-medium text-gray-700">
                        Search
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="universitySearch"
                          placeholder="Search by name or location"
                          className="pl-9 border-purple-100"
                        />
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <Search className="mr-2 h-4 w-4" /> Search
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {universities.map((university) => (
                  <Card key={university.id} className="border-purple-100">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-shrink-0 flex items-start justify-center">
                          <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center">
                            <img
                              src={university.logo || "/placeholder.svg"}
                              alt={`${university.name} Logo`}
                              className="w-12 h-12 object-contain"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-purple-800 mb-1">{university.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{university.location}</p>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Programs:</strong> {university.programsCount}
                          </p>
                          <p className="text-sm text-gray-600 mb-3">
                            <strong>Students:</strong> {university.studentsCount}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-purple-600 border-purple-200 hover:bg-purple-50"
                            >
                                  <Eye className="mr-1 h-3 w-3" /> View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "students" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-purple-800">Students Overview</h2>
              </div>

              <Card className="border-purple-100">
                <CardContent className="p-6">
                  <form className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="studentSearch" className="text-sm font-medium text-gray-700">
                        Search
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="studentSearch"
                          placeholder="Search by name or email"
                          className="pl-9 border-purple-100"
                        />
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <Search className="mr-2 h-4 w-4" /> Search
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {students.map((student) => (
                  <Card key={student.id} className="border-purple-100">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-shrink-0 flex items-start justify-center">
                          <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center overflow-hidden">
                            <img
                              src={student.profilePicture || "/placeholder.svg"}
                              alt={`${student.firstName} ${student.lastName} Avatar`}
                              className="w-16 h-16 object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-purple-800 mb-1">
                            {student.firstName} {student.lastName}
                          </h3>
                          <p className="text-sm text-gray-600 mb-1">{student.email}</p>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Education:</strong> {student.education}
                          </p>
                          <p className="text-sm text-gray-600 mb-3">
                            <strong>Applications:</strong> {student.applicationsCount}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-purple-600 border-purple-200 hover:bg-purple-50"
                            >
                                  <Eye className="mr-1 h-3 w-3" /> View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "programs" && (
            <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-purple-800">Programs Overview</h2>

              <Card className="border-purple-100">
                <CardContent className="p-6">
                      <form className="grid gap-4 md:grid-cols-3">
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
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="universityFilter" className="text-sm font-medium text-gray-700">
                        University
                      </label>
                      <Select>
                        <SelectTrigger id="universityFilter" className="border-purple-100">
                          <SelectValue placeholder="All Universities" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Universities</SelectItem>
                          {universities.map((university) => (
                            <SelectItem key={university.id} value={university.id.toString()}>
                              {university.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <Search className="mr-2 h-4 w-4" /> Search
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {programs.map((program) => (
                  <Card key={program.id} className="border-purple-100">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                              <h3 className="text-lg font-bold text-purple-800 mb-1">{program.name || 'Unnamed Program'}</h3>
                              <p className="text-sm text-gray-600 mb-1">{program.university?.name || 'Unknown University'}</p>
                          <p className="text-sm text-gray-600 mb-2">
                                {program.degree || 'No Degree'} • {program.duration || 'Duration not specified'}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                                <strong>Tuition Fee:</strong> ${(program.tuitionFee || 0).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                                <strong>Applications:</strong> {program.applicationCount || 0}
                          </p>
                        </div>
                        <div className="flex flex-row md:flex-col gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-purple-600 border-purple-200 hover:bg-purple-50"
                          >
                                <Eye className="mr-2 h-4 w-4" /> View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-800">Platform Settings</h2>

              <Card className="border-purple-100">
                <CardContent className="p-6">
                  <form className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="platformName" className="text-sm font-medium text-gray-700">
                          Platform Name
                        </label>
                            <Input 
                              id="platformName" 
                              value={settings.platformName}
                              onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                              className="border-purple-100" 
                            />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">
                          Contact Email
                        </label>
                            <Input 
                              id="contactEmail" 
                              value={settings.contactEmail}
                              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                              className="border-purple-100" 
                            />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-700">
                          Maintenance Mode
                        </label>
                            <Select 
                              value={settings.maintenanceMode ? "true" : "false"}
                              onValueChange={(value) => setSettings({ ...settings, maintenanceMode: value === "true" })}
                            >
                          <SelectTrigger id="maintenanceMode" className="border-purple-100">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="false">Disabled</SelectItem>
                            <SelectItem value="true">Enabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label htmlFor="maintenanceMessage" className="text-sm font-medium text-gray-700">
                          Maintenance Message
                        </label>
                        <textarea
                          id="maintenanceMessage"
                          rows={4}
                          className="w-full p-2 border border-purple-100 rounded-md"
                          placeholder="Message to display during maintenance"
                              value={settings.maintenanceMessage}
                              onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                        ></textarea>
                      </div>
                    </div>
                    <Button className="w-full md:w-auto bg-purple-600 hover:bg-purple-700">Save Settings</Button>
                  </form>
                </CardContent>
              </Card>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
