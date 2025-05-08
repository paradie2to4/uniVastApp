"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  University,
  BookOpen,
  User,
  GraduationCap,
  MapPin,
  DollarSign,
  Clock,
  Grid,
  List,
} from "lucide-react"
import DashboardSidebar from "@/components/dashboard-sidebar"
import DashboardHeader from "@/components/dashboard-header"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

interface Program {
  id: number
  name: string
  university: {
    id: number
    name: string
    location: string
  }
  degree: string
  duration: string
  tuitionFee: number
  applicationCount: number
  description: string
  requirements: string
}

interface University {
  id: number
  name: string
  location: string
  logo?: string
  programsCount: number
  studentsCount: number
}

interface Application {
  id: number
  studentId: number
  programId: number
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  applicationDate: string
  personalStatement: string
  uploadedFilePath?: string
  feedback?: string
}

export default function StudentDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("programs")
  const [programs, setPrograms] = useState<Program[]>([])
  const [universities, setUniversities] = useState<University[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUniversity, setSelectedUniversity] = useState<string>("all")
  const [selectedDegree, setSelectedDegree] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [isApplying, setIsApplying] = useState(false)
  const [applicationError, setApplicationError] = useState<string | null>(null)
  const [myApplications, setMyApplications] = useState<Application[]>([])
  const [personalStatement, setPersonalStatement] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("univast_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!user) return; // Wait until user is loaded

    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Load all programs
        const programsResponse = await fetch("http://localhost:8080/api/programs")
        if (!programsResponse.ok) {
          throw new Error(`Failed to load programs: ${programsResponse.statusText}`)
        }
        const programsData = await programsResponse.json()
        setPrograms(programsData)

        // Load universities
        const universitiesResponse = await fetch("http://localhost:8080/api/universities")
        if (!universitiesResponse.ok) {
          throw new Error(`Failed to load universities: ${universitiesResponse.statusText}`)
        }
        const universitiesData = await universitiesResponse.json()
        setUniversities(universitiesData)

        // Load user's applications
        const studentId = user?.id;
        if (!studentId) throw new Error("Student ID not found in user info");
        const applicationsResponse = await fetch(`http://localhost:8080/api/applications/student/${studentId}`)
        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json()
          setMyApplications(applicationsData)
        }
      } catch (error) {
        console.error("Error loading data:", error)
        setError(error instanceof Error ? error.message : "Failed to load data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user])

  // Load programs for a specific university
  const loadUniversityPrograms = async (universityId: string) => {
    if (universityId === "all") {
      // Reload all programs
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("http://localhost:8080/api/programs")
        if (!response.ok) throw new Error("Failed to load programs")
        const data = await response.json()
        console.log('Reloaded all programs:', data)
        setPrograms(data)
      } catch (error) {
        console.error("Error loading programs:", error)
        setError("Failed to load programs. Please try again later.")
      } finally {
        setIsLoading(false)
      }
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      console.log('Fetching programs for university:', universityId)
      const response = await fetch(`http://localhost:8080/api/universities/${universityId}/programs`)
      console.log('University programs response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('University programs API error:', errorText)
        throw new Error(`Failed to load university programs: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Loaded university programs data:', data)
      
      if (!Array.isArray(data)) {
        console.error('University programs data is not an array:', data)
        throw new Error('Invalid university programs data format')
      }

      setPrograms(data)
    } catch (error) {
      console.error("Error loading university programs:", error)
      setError(error instanceof Error ? error.message : "Failed to load university programs.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle university selection change
  useEffect(() => {
    console.log('University selection changed to:', selectedUniversity)
    loadUniversityPrograms(selectedUniversity)
  }, [selectedUniversity])

  // Filter and sort programs
  const filteredAndSortedPrograms = programs
    .filter((program) => {
      if (!program) return false;
      
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = 
        (program.name || '').toLowerCase().includes(searchLower) ||
        (program.university?.name || '').toLowerCase().includes(searchLower) ||
        (program.degree || '').toLowerCase().includes(searchLower)
      
      const matchesDegree = selectedDegree === "all" || 
        (program.degree || '').toLowerCase() === selectedDegree.toLowerCase()
      
      return matchesSearch && matchesDegree
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || '').localeCompare(b.name || '')
        case "tuition":
          return (a.tuitionFee || 0) - (b.tuitionFee || 0)
        case "duration":
          return (a.duration || '').localeCompare(b.duration || '')
        default:
          return 0
      }
    })

  // Handle program card click
  const handleProgramClick = async (program: Program) => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('Loading details for program:', program.id)
      const response = await fetch(`http://localhost:8080/api/programs/${program.id}`)
      console.log('Program details response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Program details API error:', errorText)
        throw new Error(`Failed to load program details: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Loaded program details:', data)
      setSelectedProgram(data)
    } catch (error) {
      console.error("Error loading program details:", error)
      setError(error instanceof Error ? error.message : "Failed to load program details.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle program application
  const handleApply = async (programId: number) => {
    try {
      setIsApplying(true)
      setApplicationError(null)

      const studentId = user?.id;
      if (!studentId) throw new Error("Student ID not found in user info");

      // First, create the application
      const response = await fetch("http://localhost:8080/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          programId,
          personalStatement,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to submit application: ${response.status} ${response.statusText}`)
      }

      const newApplication = await response.json()

      // If there's a file selected, upload it
      if (selectedFile) {
        const formData = new FormData()
        formData.append("file", selectedFile)

        const uploadResponse = await fetch(`http://localhost:8080/api/applications/${newApplication.id}/upload`, {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload file")
        }
      }

      setMyApplications([...myApplications, newApplication])
      setSelectedProgram(null) // Close the dialog
      setPersonalStatement("") // Reset form
      setSelectedFile(null) // Reset file
      
      // Show success message
      alert("Application submitted successfully!")
    } catch (error) {
      console.error("Error submitting application:", error)
      setApplicationError(error instanceof Error ? error.message : "Failed to submit application.")
    } finally {
      setIsApplying(false)
    }
  }

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  // Check if user has already applied to a program
  const hasApplied = (programId: number) => {
    return myApplications.some(app => app.programId === programId)
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredAndSortedPrograms.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredAndSortedPrograms.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const sidebarItems = [
    { icon: <GraduationCap size={20} />, label: "Programs", tab: "programs" },
    { icon: <University size={20} />, label: "Universities", tab: "universities" },
    { icon: <User size={20} />, label: "My Applications", tab: "applications" },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        items={sidebarItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        logoIcon={<GraduationCap size={20} />}
        logoText="UniVast"
      />

      <div className="flex-1">
        <DashboardHeader 
          userType="Student" 
          userName={user ? `${user.firstName} ${user.lastName}` : 'Student'} 
          userAvatar={user?.profilePicture || "/placeholder.svg"} 
        />

        <main className="p-6">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
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
              {activeTab === "programs" && (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Available Programs</h2>
                  </div>

                  <Card>
                    <CardContent className="p-6">
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Search</label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search programs..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-9"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">University</label>
                          <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                            <SelectTrigger>
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
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Degree</label>
                          <Select value={selectedDegree} onValueChange={setSelectedDegree}>
                            <SelectTrigger>
                              <SelectValue placeholder="All Degrees" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Degrees</SelectItem>
                              <SelectItem value="bachelor">Bachelor's</SelectItem>
                              <SelectItem value="master">Master's</SelectItem>
                              <SelectItem value="phd">PhD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {filteredAndSortedPrograms.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No programs found matching your criteria.</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {currentItems.map((program) => (
                          <Card 
                            key={program.id} 
                            className="hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => handleProgramClick(program)}
                          >
                            <CardContent className="p-6">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-semibold text-gray-900">{program.name || 'Unnamed Program'}</h3>
                                  <span className="text-sm text-gray-500">{program.degree || 'No Degree'}</span>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <University className="h-4 w-4 mr-2" />
                                    {program.university?.name || 'Unknown University'}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    {program.university?.location || 'Location not specified'}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Clock className="h-4 w-4 mr-2" />
                                    {program.duration || 'Duration not specified'}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    ${(program.tuitionFee || 0).toLocaleString()}
                                  </div>
                                </div>
                                <Button className="w-full">View Details</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="mt-6">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious 
                                  onClick={() => handlePageChange(currentPage - 1)}
                                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                              </PaginationItem>
                              
                              {[...Array(totalPages)].map((_, index) => (
                                <PaginationItem key={index + 1}>
                                  <PaginationLink
                                    onClick={() => handlePageChange(index + 1)}
                                    isActive={currentPage === index + 1}
                                  >
                                    {index + 1}
                                  </PaginationLink>
                                </PaginationItem>
                              ))}

                              <PaginationItem>
                                <PaginationNext 
                                  onClick={() => handlePageChange(currentPage + 1)}
                                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}
                    </>
                  )}

                  {/* Program Details Dialog */}
                  <Dialog open={!!selectedProgram} onOpenChange={() => {
                    setSelectedProgram(null)
                    setPersonalStatement("")
                    setSelectedFile(null)
                  }}>
                    <DialogContent className="max-w-2xl">
                      {selectedProgram && (
                        <>
                          <DialogHeader>
                            <DialogTitle>{selectedProgram.name}</DialogTitle>
                            <DialogDescription>
                              {selectedProgram.university?.name} • {selectedProgram.degree}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-900">Program Details</h4>
                                <p className="text-sm text-gray-600 mt-1">{selectedProgram.description}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">Requirements</h4>
                                <p className="text-sm text-gray-600 mt-1">{selectedProgram.requirements}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-900">Duration</h4>
                                <p className="text-sm text-gray-600 mt-1">{selectedProgram.duration}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">Tuition Fee</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  ${selectedProgram.tuitionFee.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">Location</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {selectedProgram.university?.location}
                                </p>
                              </div>
                            </div>

                            {!hasApplied(selectedProgram.id) && (
                              <div className="space-y-4 mt-4">
                                <div>
                                  <Label htmlFor="personalStatement">Personal Statement</Label>
                                  <Textarea
                                    id="personalStatement"
                                    value={personalStatement}
                                    onChange={(e) => setPersonalStatement(e.target.value)}
                                    placeholder="Write your personal statement here..."
                                    className="mt-1"
                                    rows={4}
                                  />
                                  {/*  <div>
                                  <Label htmlFor="file">Upload Documents</Label>
                                  <Input
                                    id="file"
                                    type="file"
                                    onChange={handleFileChange}
                                    className="mt-1"
                                  />
                                  {selectedFile && (
                                    <p className="text-sm text-gray-500 mt-1">
                                      Selected file: {selectedFile.name}
                                    </p>
                                  )}
                                </div>*/}
                                </div>

                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => {
                              setSelectedProgram(null)
                              setPersonalStatement("")
                              setSelectedFile(null)
                            }}>
                              Close
                            </Button>
                            {hasApplied(selectedProgram.id) ? (
                              <Button disabled>Already Applied</Button>
                            ) : (
                              <Button 
                                onClick={() => handleApply(selectedProgram.id)}
                                disabled={isApplying || !personalStatement.trim()}
                              >
                                {isApplying ? "Submitting..." : "Apply Now"}
                              </Button>
                            )}
                          </DialogFooter>
                          {applicationError && (
                            <div className="mt-4 text-sm text-red-600">
                              {applicationError}
                            </div>
                          )}
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                </>
              )}

              {activeTab === "universities" && (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Universities</h2>
                  </div>

                  <Card>
                    <CardContent className="p-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search universities..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {universities
                      .filter((university) =>
                        university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        university.location.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((university) => (
                        <Card key={university.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                                  <img
                                    src={university.logo || "/placeholder.svg"}
                                    alt={`${university.name} logo`}
                                    className="w-16 h-16 object-contain"
                                  />
                                </div>
                              </div>
                              <div className="text-center">
                                <h3 className="text-lg font-semibold text-gray-900">{university.name}</h3>
                                <p className="text-sm text-gray-600">{university.location}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{university.programsCount}</p>
                                  <p className="text-xs text-gray-500">Programs</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{university.studentsCount}</p>
                                  <p className="text-xs text-gray-500">Students</p>
                                </div>
                              </div>
                              <Button 
                                className="w-full"
                                onClick={() => {
                                  setSelectedUniversity(university.id.toString())
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
                </>
              )}

              {activeTab === "applications" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
                  
                  {myApplications.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600">You haven't submitted any applications yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myApplications.map((application) => {
                        const program = programs.find(p => p.id === application.programId)
                        return (
                          <Card key={application.id}>
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {program?.name || 'Program'}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {program?.university?.name || 'Unknown University'}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-2">
                                    Applied on: {new Date(application.applicationDate).toLocaleDateString()}
                                  </p>
                                  {application.personalStatement && (
                                    <p className="text-sm text-gray-600 mt-2">
                                      <strong>Personal Statement:</strong> {application.personalStatement}
                                    </p>
                                  )}
                                  {application.feedback && (
                                    <p className="text-sm text-gray-600 mt-2">
                                      <strong>Feedback:</strong> {application.feedback}
                                    </p>
                                  )}
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-medium
                                  ${application.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                                  ${application.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : ''}
                                  ${application.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
                                `}>
                                  {application.status}
                                </div>
                              </div>
                              {application.uploadedFilePath && (
                                <div className="mt-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(`http://localhost:8080/api/applications/files/${application.id}`, '_blank')}
                                  >
                                    Download Uploaded Document
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
} 