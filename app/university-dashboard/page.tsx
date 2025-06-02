"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
<<<<<<< HEAD
import { FileText, Search, University, BookOpen, LineChartIcon as ChartLine, Plus, Pencil, Trash2 } from "lucide-react"
=======
import { FileText, Search, University, BookOpen, LineChartIcon as ChartLine, Plus, Pencil, Trash2, Clock, DollarSign } from "lucide-react"
>>>>>>> 47f4fab (Updated with new features)
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
<<<<<<< HEAD

// Add interfaces for our data types
=======
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

// Add interfaces for our data types
interface UniversityData {
  name: string;
  logo: string;
  acceptanceRate: number;
  description: string;
  location: string;
  website: string;
  phoneNumber: string;
  foundedYear: number | undefined;
  accreditation: string;
}

>>>>>>> 47f4fab (Updated with new features)
interface Program {
  id: number
  name: string
  degree: string
  duration: string
  description: string
  tuitionFee: number
  applicationCount: number
<<<<<<< HEAD
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
=======
  university?: {
    id: number
  }
}

// Updated Student interface to match StudentProfileDTO
interface Student {
  id?: number; // Added ID as it's in DTO
  firstName: string
  lastName: string
  email: string
  profilePicture?: string | null; // Allow null
  bio?: string | null; // Allow null
  gpa?: number | null; // Allow null
  dateOfBirth?: string | null; // Expecting YYYY-MM-DD format from backend DTO, allow null
  location?: string | null; // Allow null
  educationBackground?: string | null; // Allow null
}

interface Application {
  id: number;
  program: { name: string };
  student: Student;
  status: string;
  createdAt: string;
  feedback?: string;
  uploadedFilePath?: string;
  personalStatement?: string;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentGpa?: number;
  programId: number;
  programName: string;
  universityId: number;
  universityName: string;
  submissionDate: string;
  lastUpdated: string;
>>>>>>> 47f4fab (Updated with new features)
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
<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isAddProgramDialogOpen, setIsAddProgramDialogOpen] = useState(false)
  const [universityData, setUniversityData] = useState({
    name: "University",
    logo: "/placeholder.svg?height=40&width=40",
    acceptanceRate: 5,
=======
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isAddProgramDialogOpen, setIsAddProgramDialogOpen] = useState(false)
  const [isEditProgramDialogOpen, setIsEditProgramDialogOpen] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [universityData, setUniversityData] = useState<UniversityData>({
    name: "University",
    logo: "/placeholder.svg?height=40&width=40",
    acceptanceRate: 5,
    description: "",
    location: "",
    website: "",
    phoneNumber: "",
    foundedYear: undefined,
    accreditation: ""
>>>>>>> 47f4fab (Updated with new features)
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

<<<<<<< HEAD
=======
  // Add state for profile form
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false)
  const [profileError, setProfileError] = useState("")

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)

  // Add pagination state for applications
  const [currentApplicationsPage, setCurrentApplicationsPage] = useState(1)
  const [applicationsPerPage] = useState(5)

  // Add user state
  const [user, setUser] = useState<any>(null);

  // Add state for student profile data and dialog
  const [isStudentProfileDialogOpen, setIsStudentProfileDialogOpen] = useState(false);
  const [viewedStudentProfile, setViewedStudentProfile] = useState<Student | null>(null);
  const [isFetchingStudentProfile, setIsFetchingStudentProfile] = useState(false);
  const [fetchStudentProfileError, setFetchStudentProfileError] = useState<string | null>(null);

  // Add search query state
  const [searchQuery, setSearchQuery] = useState("");

  // Add authentication check
  useEffect(() => {
    const token = localStorage.getItem("univast_token");
    const userData = localStorage.getItem("univast_user");
    
    if (!token || !userData) {
      router.push("/auth?tab=login");
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== "UNIVERSITY") {
      router.push("/auth?tab=login");
      return;
    }
    // Set the user state here
    setUser(user);
  }, [router]);

>>>>>>> 47f4fab (Updated with new features)
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

<<<<<<< HEAD
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
=======
  // Add logout function
  const handleLogout = () => {
    localStorage.removeItem("univast_token");
    localStorage.removeItem("univast_user");
    // Optionally clear cookies if used for session management
    // Cookies.remove('is_logged_in');
    router.push("/auth?tab=login");
  };

  // Load university data and fetch programs/applications
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setFetchError("");
      try {
        const token = localStorage.getItem("univast_token");
        const storedUserData = localStorage.getItem("univast_user");
        
        if (!token || !storedUserData) {
          throw new Error("No authentication data found. Please log in again.");
        }

        const user = JSON.parse(storedUserData);
        
        // Check for valid user data based on role
        if (!user || !user.role) {
             throw new Error("Invalid user data. Role not found.");
        }

        let entityId: number | undefined;
        if (user.role === "UNIVERSITY") {
            if (!user.universityId) {
                 throw new Error("University ID not found in user data. Please log in again.");
            }
            entityId = user.universityId;
            // Set university data from stored user object for initial display
        setUniversityData({
          name: user.universityName || "University",
          logo: user.logo || "/placeholder.svg?height=40&width=40",
              acceptanceRate: user.acceptanceRate || 5, // Use a default if not present
          description: user.description || "",
          location: user.location || "",
          website: user.website || "",
          phoneNumber: user.phoneNumber || "",
          foundedYear: user.foundedYear || undefined,
          accreditation: user.accreditation || ""
        });
        } else {
            // Handle other roles if necessary, or throw an error if only UNIVERSITY is allowed
            throw new Error("Access denied. University account required.");
        }

        if (!entityId) {
             throw new Error("Entity ID not determined based on user role.");
        }

        // Fetch programs for this university using the entityId
        const programsResponse = await fetch(
          `http://localhost:8080/api/universities/${entityId}/programs`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        if (programsResponse.status === 404) {
          // New university with no programs yet
          setPrograms([]);
        } else if (!programsResponse.ok) {
          const errorText = await programsResponse.text();
          console.error('Programs API error:', errorText);
          throw new Error(`Failed to fetch programs: ${programsResponse.status} ${programsResponse.statusText}`);
        } else {
          const programsData = await programsResponse.json();
          setPrograms(programsData);
        }

        // Fetch applications for this university using the entityId
        console.log('Fetching applications for university ID:', entityId);
        const applicationsResponse = await fetch(
          `http://localhost:8080/api/applications/university/${entityId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (!applicationsResponse.ok) {
          const errorText = await applicationsResponse.text();
          console.error('Applications API error:', errorText);
          console.error('Response status:', applicationsResponse.status);
          console.error('Response status text:', applicationsResponse.statusText);
          throw new Error(`Failed to fetch applications: ${applicationsResponse.status} ${applicationsResponse.statusText}`);
        }
        
        const applicationsData = await applicationsResponse.json();
        console.log('Received applications data:', applicationsData);
        setApplications(applicationsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setFetchError(err instanceof Error ? err.message : "Error fetching data");
      } finally {
        setIsLoading(false);
>>>>>>> 47f4fab (Updated with new features)
      }
    }

    fetchData()
<<<<<<< HEAD
  }, [])
=======
  }, []) // Empty dependency array means this runs once on mount
>>>>>>> 47f4fab (Updated with new features)

  // Handle Add Program form submission
  const handleAddProgram = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    try {
<<<<<<< HEAD
      const storedUserData = localStorage.getItem("univast_user")
      console.log("Stored user data:", storedUserData)
      const user = storedUserData ? JSON.parse(storedUserData) : null
      console.log("Parsed user data:", user)
      const universityId = user?.id
=======
      const token = localStorage.getItem("univast_token");
      const storedUserData = localStorage.getItem("univast_user")
      
      if (!token || !storedUserData) {
        throw new Error("No authentication data found. Please log in again.");
      }

      const user = JSON.parse(storedUserData);
      const universityId = user?.universityId
>>>>>>> 47f4fab (Updated with new features)

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

<<<<<<< HEAD
=======
      const formData = new FormData();
      formData.append('name', programName);
      formData.append('degree', programDegree);
      formData.append('duration', programDuration);
      formData.append('tuitionFee', programTuition);
      formData.append('description', programDescription);

>>>>>>> 47f4fab (Updated with new features)
      const response = await fetch(
        `http://localhost:8080/api/universities/${universityId}/programs`,
        {
          method: "POST",
          headers: {
<<<<<<< HEAD
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: programName,
            degree: programDegree,
            duration: programDuration,
            tuitionFee: Number(programTuition),
            description: programDescription,
          }),
=======
            'Authorization': `Bearer ${token}`,
            "Accept": "application/json"
          },
          body: formData
>>>>>>> 47f4fab (Updated with new features)
        }
      )

      if (!response.ok) {
<<<<<<< HEAD
        const errorData = await response.text()
        console.error("Server response:", errorData)
        throw new Error(errorData || "Failed to add program")
=======
        const errorData = await response.json()
        console.error("Server response:", errorData)
        throw new Error(errorData.message || "Failed to add program")
>>>>>>> 47f4fab (Updated with new features)
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

<<<<<<< HEAD
=======
  // Function to open edit program dialog
  const openEditDialog = (program: Program) => {
    setSelectedProgram(program);
    setProgramName(program.name);
    setProgramDegree(program.degree);
    setProgramDuration(program.duration);
    setProgramTuition(program.tuitionFee.toString());
    setProgramDescription(program.description);
    setIsEditProgramDialogOpen(true);
  };

>>>>>>> 47f4fab (Updated with new features)
  // Function to handle review submit
  const handleReviewSubmit = async () => {
    if (!selectedApplication) return;
    setIsReviewSubmitting(true);
    setReviewError("");
    try {
<<<<<<< HEAD
=======
      const token = localStorage.getItem("univast_token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

>>>>>>> 47f4fab (Updated with new features)
      const response = await fetch(
        `http://localhost:8080/api/applications/${selectedApplication.id}/status`,
        {
          method: "PUT",
<<<<<<< HEAD
          headers: { "Content-Type": "application/json" },
=======
          headers: { 
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json" 
          },
>>>>>>> 47f4fab (Updated with new features)
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

<<<<<<< HEAD
=======
  // Add delete program function
  const handleDeleteProgram = async (programId: number) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    
    try {
      const token = localStorage.getItem("univast_token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await fetch(
        `http://localhost:8080/api/programs/${programId}`,
        {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete program");
      }

      // Remove the deleted program from the state
      setPrograms(prevPrograms => prevPrograms.filter(p => p.id !== programId));
    } catch (err) {
      console.error("Error deleting program:", err);
      setError(err instanceof Error ? err.message : "Error deleting program");
    }
  };

  // Add edit program function
  const handleEditProgram = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProgram) return;

    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("univast_token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const formData = new FormData();
      formData.append('name', programName);
      formData.append('degree', programDegree);
      formData.append('duration', programDuration);
      formData.append('tuitionFee', programTuition);
      formData.append('description', programDescription);

      console.log("Sending program data:", {
        name: programName,
        degree: programDegree,
        duration: programDuration,
        tuitionFee: programTuition,
        description: programDescription
      });

      const response = await fetch(
        `http://localhost:8080/api/programs/${selectedProgram.id}`,
        {
          method: "PUT",
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update program");
      }

      const updatedProgram = await response.json();
      setPrograms(prevPrograms =>
        prevPrograms.map(p => 
          p.id === selectedProgram.id 
            ? {
                ...p,
                name: programName,
                degree: programDegree,
                duration: programDuration,
                tuitionFee: Number(programTuition),
                description: programDescription
              }
            : p
        )
      );

      setIsEditProgramDialogOpen(false);
      setSelectedProgram(null);
      setProgramName("");
      setProgramDegree("");
      setProgramDuration("");
      setProgramTuition("");
      setProgramDescription("");
    } catch (err) {
      console.error("Error updating program:", err);
      setError(err instanceof Error ? err.message : "Error updating program");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add handleProfileSubmit function
  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProfileSubmitting(true);
    setProfileError("");

    // Frontend validation for Founded Year
    const currentYear = new Date().getFullYear();
    if (universityData.foundedYear !== undefined && universityData.foundedYear > currentYear) {
        setProfileError("Founded year cannot be in the future.");
        setIsProfileSubmitting(false);
        return;
    }

    try {
      const token = localStorage.getItem("univast_token");
      const storedUserData = localStorage.getItem("univast_user");
      
      if (!token || !storedUserData) {
        throw new Error("No authentication data found. Please log in again.");
      }

      const user = JSON.parse(storedUserData);
      const universityId = user?.universityId;

      if (!universityId) {
        throw new Error("University ID not found in user data. Please log in again.");
      }

      const formData = new FormData();
      formData.append('name', universityData.name);
      formData.append('description', universityData.description || '');
      formData.append('location', universityData.location || '');
      formData.append('website', universityData.website || '');
      formData.append('phoneNumber', universityData.phoneNumber || '');
      formData.append('foundedYear', universityData.foundedYear === undefined ? '' : universityData.foundedYear.toString());
      formData.append('accreditation', universityData.accreditation || '');
      formData.append('acceptanceRate', universityData.acceptanceRate.toString());

      // If there's a new logo file, append it
      const logoInput = document.getElementById('universityLogo') as HTMLInputElement;
      if (logoInput?.files?.[0]) {
        formData.append('logo', logoInput.files[0]);
      }

      console.log("Sending profile data:", {
        name: universityData.name,
        description: universityData.description,
        location: universityData.location,
        website: universityData.website,
        phoneNumber: universityData.phoneNumber,
        foundedYear: universityData.foundedYear,
        accreditation: universityData.accreditation,
        acceptanceRate: universityData.acceptanceRate,
        hasLogo: !!logoInput?.files?.[0]
      });

      const response = await fetch(
        `http://localhost:8080/api/universities/${universityId}/profile`,
        {
          method: "PUT",
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      );

      let responseData;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          responseData = await response.json();
        } catch (e) {
          console.error("Error parsing JSON response:", e);
          throw new Error("Failed to parse server response");
        }
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned an invalid response format");
      }

      if (!response.ok) {
        const errorMessage = responseData?.message || 
          (response.status === 400 ? "Invalid input data" :
           response.status === 401 ? "Unauthorized" :
           response.status === 403 ? "Forbidden" :
           response.status === 404 ? "University not found" :
           response.status === 500 ? "Internal server error" :
           "Failed to update profile");
        console.error("Server error:", errorMessage);
        throw new Error(errorMessage);
      }

      // Update the state with the response data
      setUniversityData(prev => ({
        ...prev,
        ...responseData
      }));

      // Update the stored user data
      const updatedUserData = {
        ...user,
        universityName: responseData.name,
        logo: responseData.logo
      };
      localStorage.setItem("univast_user", JSON.stringify(updatedUserData));

    } catch (err) {
      console.error("Error updating profile:", err);
      setProfileError(err instanceof Error ? err.message : "Error updating profile");
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  // Add pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = programs.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(programs.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Add pagination logic for applications
  const indexOfLastApplication = currentApplicationsPage * applicationsPerPage
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage
  const currentApplications = applications.slice(indexOfFirstApplication, indexOfLastApplication)
  const totalApplicationsPages = Math.ceil(applications.length / applicationsPerPage)

  const handleApplicationsPageChange = (pageNumber: number) => {
    setCurrentApplicationsPage(pageNumber)
  }

  // Function to open student profile dialog
  const openStudentProfileDialog = async (studentId: number) => {
    setIsStudentProfileDialogOpen(true);
    setViewedStudentProfile(null);
    setIsFetchingStudentProfile(true);
    setFetchStudentProfileError(null);
    try {
      const token = localStorage.getItem("univast_token");
      if (!token) {
        throw new Error("No authentication data found. Please log in again.");
      }
      const response = await fetch(`http://localhost:8080/api/students/${studentId}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Student profile fetch error response:', errorText);
        throw new Error(`Failed to fetch student profile: ${response.status} - ${errorText}`);
      }

      const profileData = await response.json();
      setViewedStudentProfile(profileData);
    } catch (err) {
      console.error("Error fetching student profile:", err);
      setFetchStudentProfileError(err instanceof Error ? err.message : "Failed to load student profile.");
    } finally {
      setIsFetchingStudentProfile(false);
    }
  };

  // Helper function to get initials
  const getInitials = (firstName?: string | null, lastName?: string | null): string => {
    const firstInitial = firstName ? firstName.charAt(0) : '';
    const lastInitial = lastName ? lastName.charAt(0) : '';
    return (firstInitial + lastInitial).toUpperCase();
  };

  // Helper function to get initials for university (using name)
  const getUniversityInitials = (name?: string | null): string => {
    if (!name) return '';
    const words = name.split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    } else if (words.length > 1) {
        // Take first letter of first and last word (if they exist and are not empty)
        const firstInitial = words[0].charAt(0);
        const lastInitial = words[words.length - 1].charAt(0);
        return (firstInitial + lastInitial).toUpperCase();
    }
    return '';
  };

>>>>>>> 47f4fab (Updated with new features)
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
<<<<<<< HEAD
    <div className="flex min-h-screen bg-white">
=======
    <div className="flex h-screen bg-white">
>>>>>>> 47f4fab (Updated with new features)
      <DashboardSidebar
        items={sidebarItems}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        logoIcon={<University size={20} />}
        logoText="UniVast"
<<<<<<< HEAD
      />

      <div className="flex-1 flex flex-col">
        <DashboardHeader 
          userType="University Admin" 
          userName={universityData.name} 
          userAvatar={universityData.logo} 
=======
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <DashboardHeader 
          userType="University Admin" 
          userName={universityData.name} 
          userAvatar={universityData.logo ? (universityData.logo.startsWith('/') ? `http://localhost:8080${universityData.logo}` : universityData.logo) : "/placeholder.svg?height=40&width=40"}
>>>>>>> 47f4fab (Updated with new features)
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

<<<<<<< HEAD
        <main className="flex-1 p-6 md:p-8">
=======
        <main className="p-6 md:p-8">
>>>>>>> 47f4fab (Updated with new features)
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
<<<<<<< HEAD
                              <h3 className="font-medium text-purple-800">{app.program?.name || "Program"}</h3>
=======
                              <h3 className="font-medium text-purple-800">{app.programName || "Program"}</h3>
>>>>>>> 47f4fab (Updated with new features)
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
<<<<<<< HEAD
                              <strong>Student:</strong> {app.student && typeof app.student.firstName === 'string' ? `${app.student.firstName} ${app.student.lastName}` : "Unknown"}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Applied:</strong> {formatDate(app.createdAt)}
=======
                              <strong>Student:</strong>
                              <span 
                                className="text-purple-600 hover:underline ml-1 cursor-pointer"
                                onClick={() => openStudentProfileDialog(app.studentId)}
                              >
                                {app.studentName || "Unknown"}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                            <strong>Applied:</strong> {formatDate(app.submissionDate)}
>>>>>>> 47f4fab (Updated with new features)
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
<<<<<<< HEAD
                <h2 className="text-2xl font-bold text-purple-800">Programs Management</h2>
                <Dialog open={isAddProgramDialogOpen} onOpenChange={setIsAddProgramDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700">
=======
                <h2 className="text-2xl font-bold text-purple-800">Programs</h2>
                <Dialog open={isAddProgramDialogOpen} onOpenChange={setIsAddProgramDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
>>>>>>> 47f4fab (Updated with new features)
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
<<<<<<< HEAD
                    <form className="space-y-4 py-4" onSubmit={handleAddProgram}>
=======
                    <form onSubmit={handleAddProgram} className="space-y-4">
>>>>>>> 47f4fab (Updated with new features)
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
<<<<<<< HEAD
                              <SelectItem value="BACHELOR">Bachelor</SelectItem>
                              <SelectItem value="MASTER">Master</SelectItem>
=======
                              <SelectItem value="BACHELOR">Bachelor's</SelectItem>
                              <SelectItem value="MASTER">Master's</SelectItem>
>>>>>>> 47f4fab (Updated with new features)
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

<<<<<<< HEAD
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
=======
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {currentItems.map((program) => (
                  <Card key={program.id} className="border-purple-100">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                            <p className="text-sm text-gray-600">{program.degree}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(program)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteProgram(program.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            {program.duration}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="h-4 w-4 mr-2" />
                            ${program.tuitionFee.toLocaleString()}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{program.description}</p>
>>>>>>> 47f4fab (Updated with new features)
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
<<<<<<< HEAD
=======

              {/* Edit Program Dialog */}
              <Dialog open={isEditProgramDialogOpen} onOpenChange={setIsEditProgramDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Program</DialogTitle>
                    <DialogDescription>
                      Update the program details. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleEditProgram} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="editProgramName">Program Name</Label>
                      <Input
                        id="editProgramName"
                        value={programName}
                        onChange={(e) => setProgramName(e.target.value)}
                        placeholder="e.g. Computer Science"
                        className="border-purple-100"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="editProgramDegree">Degree</Label>
                        <Select value={programDegree} onValueChange={setProgramDegree} required>
                          <SelectTrigger id="editProgramDegree" className="border-purple-100">
                            <SelectValue placeholder="Select degree" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BACHELOR">Bachelor's</SelectItem>
                            <SelectItem value="MASTER">Master's</SelectItem>
                            <SelectItem value="PHD">PhD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editProgramDuration">Duration</Label>
                        <Input
                          id="editProgramDuration"
                          value={programDuration}
                          onChange={(e) => setProgramDuration(e.target.value)}
                          placeholder="e.g. 4 years"
                          className="border-purple-100"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editProgramTuition">Tuition Fee ($)</Label>
                      <Input
                        id="editProgramTuition"
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
                      <Label htmlFor="editProgramDescription">Description</Label>
                      <Textarea
                        id="editProgramDescription"
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
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

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
>>>>>>> 47f4fab (Updated with new features)
            </div>
          )}

          {activeTab === "applications" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-800">Applications Management</h2>
              <div className="space-y-4">
<<<<<<< HEAD
                {applications.map((app) => (
=======
                {currentApplications.map((app) => (
>>>>>>> 47f4fab (Updated with new features)
                  <Card key={app.id} className="border-purple-100">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
<<<<<<< HEAD
                            <h3 className="text-lg font-bold text-purple-800">{app.program?.name || "Unknown Program"}</h3>
=======
                            <h3 className="text-lg font-bold text-purple-800">{app.programName || "Unknown Program"}</h3>
>>>>>>> 47f4fab (Updated with new features)
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
<<<<<<< HEAD
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
=======
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                              <strong>Student:</strong>
                              <span 
                                className="text-purple-600 hover:underline ml-1 cursor-pointer"
                                onClick={() => openStudentProfileDialog(app.studentId)}
                              >
                                {app.studentName || "Unknown"}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Email:</strong> {app.studentEmail || "N/A"}
                            </p>
                          
                            <p className="text-sm text-gray-600">
                              <strong>Applied:</strong> {formatDate(app.submissionDate)}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Last Updated:</strong> {formatDate(app.lastUpdated)}
                            </p>
                            {app.personalStatement && (
                              <div className="mt-2">
                                <h4 className="text-sm font-medium text-gray-700">Personal Statement:</h4>
                                <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-3 rounded-md">
                                  {app.personalStatement}
                                </p>
                              </div>
                            )}
                            {app.feedback && (
                              <div className="mt-2">
                                <h4 className="text-sm font-medium text-gray-700">Feedback:</h4>
                                <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-3 rounded-md">
                                  {app.feedback}
                                </p>
                              </div>
                            )}
                            {/* Add view uploaded files link for University Admin */}
                            {app.uploadedFilePath && (
                              <div className="mt-2">
                                <a 
                                  href={`http://localhost:8080/api/applications/files/${app.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-600 hover:underline text-sm font-medium"
                                >
                                  View Uploaded File
                                </a>
                              </div>
                            )}
                          </div>
>>>>>>> 47f4fab (Updated with new features)
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
<<<<<<< HEAD
=======

              {/* Applications Pagination */}
              {totalApplicationsPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handleApplicationsPageChange(currentApplicationsPage - 1)}
                          className={currentApplicationsPage === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      
                      {[...Array(totalApplicationsPages)].map((_, index) => (
                        <PaginationItem key={index + 1}>
                          <PaginationLink
                            onClick={() => handleApplicationsPageChange(index + 1)}
                            isActive={currentApplicationsPage === index + 1}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handleApplicationsPageChange(currentApplicationsPage + 1)}
                          className={currentApplicationsPage === totalApplicationsPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-800">University Profile</h2>
              <Card className="border-purple-100">
                <CardContent className="p-6">
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="universityName">University Name</Label>
                      <Input
                        id="universityName"
                        value={universityData.name}
                        onChange={(e) => setUniversityData(prev => ({ ...prev, name: e.target.value }))}
                        className="border-purple-100 max-w-sm"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="universityLogo">University Logo</Label>
                      <Input
                        id="universityLogo"
                        type="file"
                        accept="image/*"
                        className="border-purple-100 max-w-sm"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Create a preview URL for the image
                            const previewUrl = URL.createObjectURL(file);
                            setUniversityData(prev => ({ ...prev, logo: previewUrl }));
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="universityDescription">Description</Label>
                      <Textarea
                        id="universityDescription"
                        value={universityData.description}
                        onChange={(e) => setUniversityData(prev => ({ ...prev, description: e.target.value }))}
                        className="border-purple-100 max-w-sm"
                        rows={4}
                        placeholder="Describe your university"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="universityLocation">Location</Label>
                      <Input
                        id="universityLocation"
                        value={universityData.location}
                        onChange={(e) => setUniversityData(prev => ({ ...prev, location: e.target.value }))}
                        className="border-purple-100 max-w-sm"
                        placeholder="City, Country"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="universityWebsite">Website</Label>
                      <Input
                        id="universityWebsite"
                        type="url"
                        value={universityData.website}
                        onChange={(e) => setUniversityData(prev => ({ ...prev, website: e.target.value }))}
                        className="border-purple-100 max-w-sm"
                        placeholder="https://www.university.edu"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="universityPhone">Phone Number</Label>
                      <Input
                        id="universityPhone"
                        value={universityData.phoneNumber}
                        onChange={(e) => setUniversityData(prev => ({ ...prev, phoneNumber: e.target.value.replace(/[^0-9+-]/g, '') }))}
                        className="border-purple-100 max-w-sm"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="universityFoundedYear">Founded Year</Label>
                      <Input
                        id="universityFoundedYear"
                        value={universityData.foundedYear === undefined ? '' : universityData.foundedYear}
                        onChange={(e) => {
                          const year = e.target.value.replace(/[^0-9]/g, '');
                          setUniversityData(prev => ({
                            ...prev,
                            foundedYear: year ? parseInt(year, 10) : undefined
                          }));
                        }}
                        className="border-purple-100 max-w-sm"
                        placeholder="e.g., 1900"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="universityAccreditation">Accreditation</Label>
                      <Input
                        id="universityAccreditation"
                        value={universityData.accreditation}
                        onChange={(e) => setUniversityData(prev => ({ ...prev, accreditation: e.target.value }))}
                        className="border-purple-100 max-w-sm"
                        placeholder="e.g., Regional Accreditation"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="universityAcceptanceRate">Acceptance Rate (%)</Label>
                      <Input
                        id="universityAcceptanceRate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={universityData.acceptanceRate || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setUniversityData(prev => ({
                            ...prev,
                            acceptanceRate: value === "" ? 0 : parseFloat(value)
                          }));
                        }}
                        className="border-purple-100 max-w-sm"
                        placeholder="e.g., 5"
                      />
                    </div>
                    {profileError && <div className="text-red-500">{profileError}</div>}
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isProfileSubmitting}>
                      {isProfileSubmitting ? "Saving..." : "Save Profile"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
>>>>>>> 47f4fab (Updated with new features)
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
<<<<<<< HEAD
                <strong>Program:</strong> {selectedApplication.program?.name || "Unknown Program"}
=======
                <strong>Program:</strong> {selectedApplication.programName || "Unknown Program"}
>>>>>>> 47f4fab (Updated with new features)
              </div>
              {selectedApplication.uploadedFilePath && (
                <div>
                  <strong>Uploaded File:</strong>{' '}
                  <a
<<<<<<< HEAD
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
=======
                    href={selectedApplication.uploadedFilePath}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View File
                  </a>
                </div>
              )}
            </div>
          )}
          <div className="mt-4">
            <Label htmlFor="reviewStatus">Status</Label>
            <Select 
              value={reviewStatus} 
              onValueChange={(value: ApplicationStatus | "") => setReviewStatus(value)}
            >
              <SelectTrigger id="reviewStatus" className="border-purple-100">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {APPLICATION_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4">
            <Label htmlFor="reviewFeedback">Feedback</Label>
            <Textarea
              id="reviewFeedback"
              value={reviewFeedback}
              onChange={(e) => setReviewFeedback(e.target.value)}
              placeholder="Enter feedback for the application"
              className="border-purple-100"
              rows={4}
            />
          </div>
          <div className="mt-4">
            {reviewError && <div className="text-red-500">{reviewError}</div>}
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleReviewSubmit}
              disabled={isReviewSubmitting}
            >
              {isReviewSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isStudentProfileDialogOpen} onOpenChange={setIsStudentProfileDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
          </DialogHeader>
          {isFetchingStudentProfile && (
            <div className="flex justify-center items-center h-40">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          )}
          {fetchStudentProfileError && (
            <div className="text-red-500 text-center">{fetchStudentProfileError}</div>
          )}
          {viewedStudentProfile && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center space-x-4">
                 {/* Display profile picture or initials */}
                {viewedStudentProfile.profilePicture ? (
                  <img 
                    src={viewedStudentProfile.profilePicture || '/default-avatar.png'}
                    alt={`${viewedStudentProfile.firstName} ${viewedStudentProfile.lastName}'s profile picture`}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-purple-200 flex items-center justify-center text-2xl font-bold text-purple-800">
                    {getInitials(viewedStudentProfile.firstName, viewedStudentProfile.lastName)}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold">{viewedStudentProfile.firstName} {viewedStudentProfile.lastName}</h3>
                  <p className="text-sm text-gray-600">{viewedStudentProfile.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                 <div><strong>GPA:</strong> {viewedStudentProfile.gpa || 'N/A'}</div>
                 <div><strong>Date of Birth:</strong> {viewedStudentProfile.dateOfBirth ? new Date(viewedStudentProfile.dateOfBirth).toLocaleDateString() : 'N/A'}</div>
                 <div><strong>Location:</strong> {viewedStudentProfile.location || 'N/A'}</div>
                 <div><strong>Education:</strong> {viewedStudentProfile.educationBackground || 'N/A'}</div>
              </div>
              {viewedStudentProfile.bio && (
                <div>
                  <strong>Bio:</strong>
                  <p>{viewedStudentProfile.bio}</p>
                </div>
              )}
>>>>>>> 47f4fab (Updated with new features)
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> 47f4fab (Updated with new features)
