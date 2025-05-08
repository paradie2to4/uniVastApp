"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Search, University, BookOpen, LineChartIcon as ChartLine, Plus, Pencil, Trash2 } from "lucide-react"
import DashboardSidebar from "@/components/dashboard-sidebar"
import DashboardHeader from "@/components/dashboard-header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Add interfaces for our data types
interface Program {
  id: number
  name: string
  degree: string
  duration: string
  description: string
  tuitionFee: number
  applicationCount: number
}

interface Student {
  firstName: string
  lastName: string
  email: string
  gpa: number
}

interface Application {
  id: number
  program: { name: string }
  student: Student
  status: string
  createdAt: string
  feedback?: string
  uploadedFilePath?: string
  personalStatement?: string
}

// Add ApplicationStatus type
const APPLICATION_STATUSES = [
  "PENDING",
  "UNDER_REVIEW",
  "ACCEPTED",
  "REJECTED",
  "WAITLISTED",
  "WITHDRAWN"
] as const;
type ApplicationStatus = typeof APPLICATION_STATUSES[number];

export default function UniversityDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isAddProgramDialogOpen, setIsAddProgramDialogOpen] = useState(false)
  const [universityData, setUniversityData] = useState({
    name: "University",
    logo: "/placeholder.svg?height=40&width=40",
    acceptanceRate: 5,
  })

  // Add state for Add Program form fields
  const [programName, setProgramName] = useState("")
  const [programDegree, setProgramDegree] = useState("")
  const [programDuration, setProgramDuration] = useState("")
  const [programTuition, setProgramTuition] = useState("")
  const [programDescription, setProgramDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Add state for programs and applications
  const [programs, setPrograms] = useState<Program[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState("")

  // Add state for review dialog
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [reviewStatus, setReviewStatus] = useState<ApplicationStatus | "">("");
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const sidebarItems = [
    { icon: <University size={20} />, label: "Dashboard", tab: "dashboard" },
    { icon: <BookOpen size={20} />, label: "Programs", tab: "programs" },
    { icon: <FileText size={20} />, label: "Applications", tab: "applications" },
    { icon: <University size={20} />, label: "University Profile", tab: "profile" },
  ]

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Load university data and fetch programs/applications
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setFetchError("")
      try {
        const storedUserData = localStorage.getItem("univast_user")
        if (storedUserData) {
          const user = JSON.parse(storedUserData)
          if (user.role === "UNIVERSITY") {
            setUniversityData({
              name: user.universityName || "University",
              logo: user.logo || "/placeholder.svg?height=40&width=40",
              acceptanceRate: 5,
            })

            // Fetch programs for this university
            const programsResponse = await fetch(
              `http://localhost:8080/api/universities/${user.id}/programs`
            )
            if (!programsResponse.ok) throw new Error("Failed to fetch programs")
            const programsData = await programsResponse.json()
            setPrograms(programsData)

            // Fetch applications for this university
            const applicationsResponse = await fetch(
              `http://localhost:8080/api/applications/university/${user.id}`
            )
            if (!applicationsResponse.ok) throw new Error("Failed to fetch applications")
            const applicationsData = await applicationsResponse.json()
            setApplications(applicationsData)
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setFetchError(err instanceof Error ? err.message : "Error fetching data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle Add Program form submission
  const handleAddProgram = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    try {
      const storedUserData = localStorage.getItem("univast_user")
      console.log("Stored user data:", storedUserData)
      const user = storedUserData ? JSON.parse(storedUserData) : null
      console.log("Parsed user data:", user)
      const universityId = user?.id

      if (!universityId) {
        throw new Error("University ID not found")
      }

      console.log("Using university ID:", universityId)

      console.log("Submitting program with data:", {
        name: programName,
        degree: programDegree,
        duration: programDuration,
        tuitionFee: Number(programTuition),
        description: programDescription,
      })

      const response = await fetch(
        `http://localhost:8080/api/universities/${universityId}/programs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: programName,
            degree: programDegree,
            duration: programDuration,
            tuitionFee: Number(programTuition),
            description: programDescription,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.text()
        console.error("Server response:", errorData)
        throw new Error(errorData || "Failed to add program")
      }

      const newProgram = await response.json()
      setPrograms(prevPrograms => [...prevPrograms, newProgram as Program])
      
      setIsAddProgramDialogOpen(false)
      // Reset form fields
      setProgramName("")
      setProgramDegree("")
      setProgramDuration("")
      setProgramTuition("")
      setProgramDescription("")
    } catch (err: unknown) {
      console.error("Error adding program:", err)
      setError(err instanceof Error ? err.message : "Error adding program")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to open review dialog
  const openReviewDialog = (app: Application) => {
    setSelectedApplication(app);
    setReviewStatus(app.status as ApplicationStatus);
    setReviewFeedback(app.feedback || "");
    setIsReviewDialogOpen(true);
  };

  // Function to handle review submit
  const handleReviewSubmit = async () => {
    if (!selectedApplication) return;
    setIsReviewSubmitting(true);
    setReviewError("");
    try {
      const response = await fetch(
        `http://localhost:8080/api/applications/${selectedApplication.id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: reviewStatus,
            feedback: reviewFeedback,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to update application");
      }
      // Update applications state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApplication.id
            ? { ...app, status: reviewStatus, feedback: reviewFeedback }
            : app
        )
      );
      setIsReviewDialogOpen(false);
      setSelectedApplication(null);
    } catch (err: any) {
      setReviewError(err.message || "Error updating application");
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{fetchError}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar
        items={sidebarItems}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        logoIcon={<University size={20} />}
        logoText="UniVast"
      />

      <div className="flex-1 flex flex-col">
        <DashboardHeader 
          userType="University Admin" 
          userName={universityData.name} 
          userAvatar={universityData.logo} 
        />

        <section className="bg-gradient-to-r from-purple-50 to-white p-6 md:p-8">
          <span className="text-gray-500">
            {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-purple-800 mt-1">
            Welcome, {universityData.name}!
          </h1>
          <p className="text-gray-600">Manage your programs and applications</p>
        </section>

        <main className="flex-1 p-6 md:p-8">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Quick Stats */}
                <section>
                  <h2 className="text-xl font-bold text-purple-800 mb-4">Overview</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="border-purple-100">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Programs</p>
                          <h3 className="text-2xl font-bold text-purple-800">{programs.length}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>

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
                          <p className="text-sm text-gray-500">Acceptance Rate</p>
                          <h3 className="text-2xl font-bold text-purple-800">{universityData.acceptanceRate}%</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <ChartLine className="h-5 w-5 text-purple-600" />
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
                        <p className="text-gray-500 py-4 text-center">No applications found.</p>
                      ) : (
                        applications.slice(0, 3).map((app) => (
                          <div key={app.id} className="py-3 first:pt-0 last:pb-0">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-purple-800">{app.program?.name || "Program"}</h3>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full
                                ${app.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : ""}
                                ${app.status === "ACCEPTED" ? "bg-green-100 text-green-800" : ""}
                                ${app.status === "REJECTED" ? "bg-red-100 text-red-800" : ""}
                                ${app.status === "REVIEWING" ? "bg-blue-100 text-blue-800" : ""}
                              `}
                              >
                                {app.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              <strong>Student:</strong> {app.student && typeof app.student.firstName === 'string' ? `${app.student.firstName} ${app.student.lastName}` : "Unknown"}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Applied:</strong> {formatDate(app.createdAt)}
                            </p>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </section>
              </div>
            </div>
          )}

          {activeTab === "programs" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-purple-800">Programs Management</h2>
                <Dialog open={isAddProgramDialogOpen} onOpenChange={setIsAddProgramDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="mr-2 h-4 w-4" /> Add Program
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Program</DialogTitle>
                      <DialogDescription>
                        Create a new program for your university. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4 py-4" onSubmit={handleAddProgram}>
                      <div className="space-y-2">
                        <Label htmlFor="programName">Program Name</Label>
                        <Input
                          id="programName"
                          value={programName}
                          onChange={(e) => setProgramName(e.target.value)}
                          placeholder="e.g. Computer Science"
                          className="border-purple-100"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="programDegree">Degree</Label>
                          <Select value={programDegree} onValueChange={setProgramDegree} required>
                            <SelectTrigger id="programDegree" className="border-purple-100">
                              <SelectValue placeholder="Select degree" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BACHELOR">Bachelor</SelectItem>
                              <SelectItem value="MASTER">Master</SelectItem>
                              <SelectItem value="PHD">PhD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="programDuration">Duration</Label>
                          <Input
                            id="programDuration"
                            value={programDuration}
                            onChange={(e) => setProgramDuration(e.target.value)}
                            placeholder="e.g. 4 years"
                            className="border-purple-100"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="programTuition">Tuition Fee ($)</Label>
                        <Input
                          id="programTuition"
                          type="number"
                          value={programTuition}
                          onChange={(e) => setProgramTuition(e.target.value)}
                          placeholder="e.g. 50000"
                          className="border-purple-100"
                          required
                          min="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="programDescription">Description</Label>
                        <Textarea
                          id="programDescription"
                          value={programDescription}
                          onChange={(e) => setProgramDescription(e.target.value)}
                          placeholder="Describe the program"
                          className="border-purple-100"
                          rows={3}
                          required
                        />
                      </div>
                      {error && <div className="text-red-500">{error}</div>}
                      <DialogFooter>
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
                          {isSubmitting ? "Saving..." : "Save Program"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {programs.map((program) => (
                  <Card key={program.id} className="border-purple-100">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-purple-800 mb-1">{program.name}</h3>
                          <p className="text-sm text-gray-600 mb-1">
                            {program.degree} • {program.duration}
                          </p>
                          <p className="text-sm text-gray-600 mb-3">{program.description}</p>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Tuition Fee:</strong> ${program.tuitionFee.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Applications:</strong> {program.applicationCount}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "applications" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-800">Applications Management</h2>
              <div className="space-y-4">
                {applications.map((app) => (
                  <Card key={app.id} className="border-purple-100">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-bold text-purple-800">{app.program?.name || "Unknown Program"}</h3>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full
                              ${app.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : ""}
                              ${app.status === "ACCEPTED" ? "bg-green-100 text-green-800" : ""}
                              ${app.status === "REJECTED" ? "bg-red-100 text-red-800" : ""}
                              ${app.status === "REVIEWING" ? "bg-blue-100 text-blue-800" : ""}
                            `}
                            >
                              {app.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Student:</strong> {app.student && typeof app.student.firstName === 'string' ? `${app.student.firstName} ${app.student.lastName}` : "Unknown"}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Email:</strong> {app.student && typeof app.student.email === 'string' ? app.student.email : "Unknown"}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Applied:</strong> {formatDate(app.createdAt)}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>GPA:</strong> {app.student && typeof app.student.gpa !== 'undefined' ? app.student.gpa : "N/A"}
                          </p>
                          {app.personalStatement && (
                            <div className="mt-2">
                              <h4 className="text-sm font-medium text-gray-700">Personal Statement:</h4>
                              <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-3 rounded-md">
                                {app.personalStatement}
                          </p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-end justify-end md:min-w-[120px]">
                          <Button
                            className="w-full md:w-auto bg-purple-600 hover:bg-purple-700"
                            onClick={() => openReviewDialog(app)}
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
            <DialogDescription>
              Update the status and feedback for this application.
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div>
                <strong>Student:</strong> {selectedApplication.student && typeof selectedApplication.student.firstName === 'string' ? `${selectedApplication.student.firstName} ${selectedApplication.student.lastName}` : "Unknown"}
              </div>
              <div>
                <strong>Program:</strong> {selectedApplication.program?.name || "Unknown Program"}
              </div>
              {selectedApplication.uploadedFilePath && (
                <div>
                  <strong>Uploaded File:</strong>{' '}
                  <a
                    href={`http://localhost:8080/api/applications/${selectedApplication.id}/file`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 underline"
                  >
                    View File
                  </a>
                      </div>
              )}
              {selectedApplication.personalStatement && (
                <div>
                  <strong>Personal Statement:</strong>
                  <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-3 rounded-md">
                    {selectedApplication.personalStatement}
                  </p>
                      </div>
              )}
              <div>
                <Label htmlFor="reviewStatus">Status</Label>
                <select
                  id="reviewStatus"
                  className="border rounded w-full p-2"
                  value={reviewStatus}
                  onChange={e => setReviewStatus(e.target.value as ApplicationStatus)}
                >
                  {APPLICATION_STATUSES.map((status) => (
                    <option key={status} value={status}>{status.replace(/_/g, " ")}</option>
                  ))}
                </select>
                      </div>
              <div>
                <Label htmlFor="reviewFeedback">Feedback (optional)</Label>
                <Textarea
                  id="reviewFeedback"
                  value={reviewFeedback}
                  onChange={e => setReviewFeedback(e.target.value)}
                  placeholder="Enter feedback for the applicant"
                  rows={3}
                        />
                      </div>
              {reviewError && <div className="text-red-500">{reviewError}</div>}
              <DialogFooter>
                <Button onClick={handleReviewSubmit} disabled={isReviewSubmitting} className="bg-purple-600 hover:bg-purple-700">
                  {isReviewSubmitting ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
