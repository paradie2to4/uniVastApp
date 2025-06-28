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
import { API_BASE_URL } from '@/lib/api/config'

// Add helper function for getting initials
const getInitials = (name: string) => {
  const words = name.split(' ');
  const significantWords = words.filter(word => word.toLowerCase() !== 'of' && word.toLowerCase() !== 'the');
  
  if (significantWords.length === 0) {
    return ''; // Handle cases with only common words or empty string
  }

  const initials = significantWords
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();

  // Take the first two initials if available, otherwise just the first one
  return initials.slice(0, 2);
};

// Move formatDate function outside of the component
const formatDate = (dateString: string | undefined | null) => {
  if (!dateString) {
    return 'Not available';
  }
  
  try {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error(`Invalid date string provided to formatDate: ${dateString}`);
      return 'Not available';
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'Not available';
  }
};

interface Student {
  firstName: string
  lastName: string
  email: string
  gpa?: number
  bio?: string
  profilePicture?: string
  dateOfBirth?: string
  location?: string
  educationBackground?: string
}

interface Program {
  id: number
  name: string
  degree: string
  duration: string
  tuitionFee: number
  applicationCount: number
  description: string
  requirements: string
  university: {
    id: number
    name: string
    location: string
    logo?: string
  }
}

interface University {
  id: number
  name: string
  location: string
  logo?: string
  programsCount: number
  studentsCount: number
  website?: string
  phoneNumber?: string
  foundedYear?: number
  accreditation?: string
  acceptanceRate?: number
  description?: string
}

interface Application {
  id: number
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'REVIEWING'
  personalStatement: string
  uploadedFilePath?: string
  feedback?: string
  submissionDate: string
  lastUpdated: string
  program: {
    id: number
    name: string
    university: {
      id: number
      name: string
      location: string
      logo?: string
    }
  }
  studentName?: string
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
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [hasAlreadyApplied, setHasAlreadyApplied] = useState(false);

  // Add state for University Profile Dialog
  const [isUniversityProfileDialogOpen, setIsUniversityProfileDialogOpen] = useState(false);
  const [viewedUniversity, setViewedUniversity] = useState<University | null>(null);
  const [isFetchingUniversityProfile, setIsFetchingUniversityProfile] = useState(false);
  const [fetchUniversityProfileError, setFetchUniversityProfileError] = useState<string | null>(null);

  // Add state for student profile data
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [profileFetchError, setProfileFetchError] = useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileUpdateError, setProfileUpdateError] = useState<string | null>(null);

  // Update the helper function to handle MM/DD/YYYY format
  const formatDateForBackend = (dateString: string | null | undefined): string | null => {
    if (!dateString) return null;
    try {
      console.log('Formatting date for backend:', dateString);
      
      // Handle MM/DD/YYYY format
      const [month, day, year] = dateString.split('/').map(num => parseInt(num, 10));
      console.log('Parsed date parts:', { month, day, year });
      
      if (isNaN(month) || isNaN(day) || isNaN(year)) {
        console.warn('Invalid date format:', dateString);
        return null;
      }

      // Validate date parts
      if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > 2100) {
        console.warn('Date parts out of valid range:', { month, day, year });
        return null;
      }

      // Create date object and validate
      const date = new Date(year, month - 1, day);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString);
        return null;
      }

      // Format to YYYY-MM-DD
      const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      console.log('Formatted date for backend:', formattedDate);
      return formattedDate;
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  };

  // Add a helper function to format date for display
  const formatDateForDisplay = (dateString: string | null | undefined): string | null => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString);
        return null;
      }
      
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${month}/${day}/${year}`;
    } catch (error) {
      console.error('Error formatting date for display:', error);
      return null;
    }
  };

  // Add logout function inside the component
  const handleLogout = () => {
    localStorage.removeItem("univast_token");
    localStorage.removeItem("univast_user");
    // Optionally clear cookies if used for session management
    // Cookies.remove('is_logged_in');
    router.push("/auth?tab=login");
  };

  // Add authentication check
  useEffect(() => {
    const token = localStorage.getItem("univast_token");
    const storedUser = localStorage.getItem("univast_user");
    
    if (!token || !storedUser) {
      router.push("/auth?tab=login");
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== "STUDENT") {
      router.push("/auth?tab=login");
      return;
    }

    setUser(userData);
  }, [router]);

  // Add a function to load user's applications
  const loadMyApplications = async () => {
    // Ensure user and studentId are loaded
    if (!user?.studentId) {
      console.warn("User or studentId not available, cannot load applications.");
      return; 
    }

    try {
      const token = localStorage.getItem("univast_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Use user.studentId to fetch applications
      const applicationsResponse = await fetch(`${API_BASE_URL}/api/applications/student/${user.studentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Refetched applications response status:', applicationsResponse.status);
      if (!applicationsResponse.ok) {
        const errorText = await applicationsResponse.text();
        console.error('Refetched Applications API error response text:', errorText);
        throw new Error(`Failed to load applications after submission: ${errorText}`);
      }

      const applicationsData = await applicationsResponse.json();
      setMyApplications(applicationsData);
      console.log('Refetched applications data:', applicationsData);

    } catch (err) {
      console.error("Error refetching applications:", err);
      // Optionally set an error state for refetching
    }
  };

  // Call loadMyApplications in the initial useEffect where user data is available
  useEffect(() => {
    if (!user) return; // Wait until user is loaded

    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const token = localStorage.getItem("univast_token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Load all programs
        const programsResponse = await fetch(`${API_BASE_URL}/api/programs`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!programsResponse.ok) {
          throw new Error(`Failed to load programs: ${programsResponse.statusText}`)
        }
        const programsData = await programsResponse.json()
        console.log('Programs data from backend:', programsData)
        setPrograms(programsData)

        // Load all universities
        const universitiesResponse = await fetch(`${API_BASE_URL}/api/universities`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        if (!universitiesResponse.ok) {
          const errorText = await universitiesResponse.text()
          console.error('Universities API error:', errorText)
          throw new Error(`Failed to load universities: ${universitiesResponse.status} ${universitiesResponse.statusText}`)
        }
        const universitiesData = await universitiesResponse.json()
        console.log('Loaded universities data:', universitiesData)
        console.log('First university logo path:', universitiesData[0]?.logo);
        setUniversities(universitiesData)

        // Load user's applications
        await loadMyApplications();

      } catch (err) {
        console.error("Error loading data:", err)
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user])

  // Load programs for a specific university
  const loadUniversityPrograms = async (universityId: string) => {
    const token = localStorage.getItem("univast_token");
    if (!token) {
      router.push("/auth?tab=login");
      return;
    }

    if (universityId === "all") {
      // Reload all programs
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`${API_BASE_URL}/api/programs`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
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
      const response = await fetch(`${API_BASE_URL}/api/universities/${universityId}/programs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
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
    const token = localStorage.getItem("univast_token");
    if (!token) {
      router.push("/auth?tab=login");
      return;
    }

    try {
      setSelectedProgram(program)
      setIsApplyDialogOpen(true)
      
      // Check if student has already applied with null check
      const hasApplied = myApplications.some(app => app?.program?.id === program?.id)
      setHasAlreadyApplied(hasApplied)
    } catch (error) {
      console.error("Error handling program click:", error)
      setError("Failed to load program details. Please try again later.")
    }
  }

  // Handle program application
  const handleApply = async (programId: number) => {
    const token = localStorage.getItem("univast_token");
    if (!token) {
      router.push("/auth?tab=login");
      return;
    }

    // Get user data directly from local storage
    const storedUserData = localStorage.getItem("univast_user");
    if (!storedUserData) {
        setApplicationError("User information not found. Please log in again.")
        return
    }
    const user = JSON.parse(storedUserData);

    if (!user?.id && user?.role !== 'STUDENT') { // Add role check for extra safety
      setApplicationError("Invalid user data or role. Please log in again.")
      return
    }

    // Ensure studentId is available for student role
    if (user.role === 'STUDENT' && !user.studentId) {
        setApplicationError("Student ID not found in user data. Please log in again.");
        return;
    }

    try {
      setIsApplying(true)
      setApplicationError(null)

      // Create FormData for the application submission
      const formData = new FormData();
      formData.append('programId', programId.toString());
      formData.append('studentId', user.studentId.toString()); // Use the studentId
      formData.append('personalStatement', personalStatement);
      
      // If a file is selected, append it to the FormData
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      // Send the application data using FormData
      const response = await fetch(`${API_BASE_URL}/api/applications`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          // Do NOT set Content-Type header for FormData, browser sets it automatically
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Application submission error:', errorText);
        console.error('Application submission response status:', response.status);
        throw new Error(`Failed to submit application: ${response.statusText || errorText}`);
      }

      const newApplication = await response.json();
      
      // Refetch the applications list to include the new application and its dates
      await loadMyApplications();

      setIsApplyDialogOpen(false);
      setPersonalStatement("");
      setSelectedFile(null);
      setUploadProgress(0);
      
      // Show success message
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      setApplicationError(error instanceof Error ? error.message : "Failed to submit application");
    } finally {
      setIsApplying(false);
    }
  }

  // Handle file selection with validation
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        event.target.value = '';
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a PDF or Word document");
        event.target.value = '';
        return;
      }

      setSelectedFile(file);
    }
  }

  // Check if user has already applied to a program
  const hasApplied = (programId: number) => {
    return myApplications.some(app => app?.program?.id === programId)
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredAndSortedPrograms.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredAndSortedPrograms.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const loadStudentProfile = async (studentId: number) => {
    setIsFetchingProfile(true);
    setProfileFetchError(null);
    try {
      const token = localStorage.getItem("univast_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log('Fetching profile for student ID:', studentId);
      const response = await fetch(`${API_BASE_URL}/api/students/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Profile fetch error response:', errorText);
        throw new Error(`Failed to fetch student profile: ${response.status} - ${errorText}`);
      }

      const responseText = await response.text();
      console.log('Raw response from server:', responseText);
      
      let profileData;
      try {
        profileData = JSON.parse(responseText);
        console.log('Parsed profile data:', profileData);
      } catch (parseError) {
        console.error('Error parsing profile response:', parseError);
        throw new Error('Invalid response format from server');
      }

      // Format the date for display if it exists
      if (profileData.dateOfBirth) {
        console.log('Original dateOfBirth:', profileData.dateOfBirth);
        profileData.dateOfBirth = formatDateForDisplay(profileData.dateOfBirth);
        console.log('Formatted dateOfBirth for display:', profileData.dateOfBirth);
      }

      // Ensure all fields are properly initialized
      const sanitizedProfile = {
        ...profileData,
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '',
        gpa: profileData.gpa || null,
        bio: profileData.bio || '',
        location: profileData.location || '',
        educationBackground: profileData.educationBackground || '',
        profilePicture: profileData.profilePicture || null,
        dateOfBirth: profileData.dateOfBirth || null
      };

      console.log('Final sanitized profile data:', sanitizedProfile);
      setStudentProfile(sanitizedProfile);
    } catch (err) {
      console.error("Error fetching student profile:", err);
      setProfileFetchError(err instanceof Error ? err.message : "Failed to load student profile.");
    } finally {
      setIsFetchingProfile(false);
    }
  };

  // Effect to load student profile when the 'profile' tab is active and user data is available
  useEffect(() => {
    if (activeTab === "profile" && user?.studentId) {
      loadStudentProfile(user.studentId);
    }
  }, [activeTab, user]);

  const sidebarItems = [
    { icon: <GraduationCap size={20} />, label: "Programs", tab: "programs" },
    { icon: <University size={20} />, label: "Universities", tab: "universities" },
    { icon: <User size={20} />, label: "My Applications", tab: "applications" },
    { icon: <User size={20} />, label: "My Profile", tab: "profile" },
  ]

  const handleApplyClick = (program: Program) => {
    setSelectedProgram(program);
    const alreadyApplied = myApplications.some(app => app?.program?.id === program.id);
    setHasAlreadyApplied(alreadyApplied);
    setIsApplyDialogOpen(true);
  };

  // Handle view university profile
  const handleViewProfile = async (universityId: number) => {
    setIsFetchingUniversityProfile(true);
    setFetchUniversityProfileError(null);
    setViewedUniversity(null); // Clear previous data

    try {
      const token = localStorage.getItem("univast_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/api/universities/${universityId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch university profile: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const universityData = await response.json();
      setViewedUniversity(universityData);
      setIsUniversityProfileDialogOpen(true);

    } catch (err) {
      console.error("Error fetching university profile:", err);
      setFetchUniversityProfileError(err instanceof Error ? err.message : "Failed to load university profile.");
    } finally {
      setIsFetchingUniversityProfile(false);
    }
  };

  // Add the handleProfileSubmit function
  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileUpdateError(null);

    console.log('Submitting profile with data:', studentProfile);

    // Frontend validation for Date of Birth
    if (studentProfile?.dateOfBirth) {
      console.log('Validating date of birth:', studentProfile.dateOfBirth);
      const [month, day, year] = studentProfile.dateOfBirth.split('/').map(num => parseInt(num, 10));
      const selectedDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        setProfileUpdateError("Date of birth cannot be in the future.");
        setIsUpdatingProfile(false);
        return;
      }
    }

    const studentId = user?.studentId;
    if (!studentId) {
      setProfileUpdateError("Student ID not found. Please log in again.");
      setIsUpdatingProfile(false);
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    if (studentProfile?.firstName) formData.append('firstName', studentProfile.firstName);
    if (studentProfile?.lastName) formData.append('lastName', studentProfile.lastName);
    if (studentProfile?.gpa !== undefined && studentProfile.gpa !== null) formData.append('gpa', studentProfile.gpa.toString());
    if (studentProfile?.bio !== undefined) formData.append('bio', studentProfile.bio);

    // Format date for backend
    const formattedDate = formatDateForBackend(studentProfile?.dateOfBirth);
    console.log('Formatted date for backend submission:', formattedDate);
    if (formattedDate) {
      formData.append('dateOfBirth', formattedDate);
    }

    if (studentProfile?.location !== undefined) formData.append('location', studentProfile.location);
    if (studentProfile?.educationBackground !== undefined) formData.append('educationBackground', studentProfile.educationBackground);

    // Append profile picture file if selected
    const profilePictureInput = document.getElementById('profilePicture') as HTMLInputElement;
    if (profilePictureInput?.files?.[0]) {
      formData.append('profilePicture', profilePictureInput.files[0]);
    }

    try {
      const token = localStorage.getItem("univast_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log('Sending profile update request...');
      const response = await fetch(`${API_BASE_URL}/api/students/${studentId}/profile`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Profile update backend error:', errorText);
        setProfileUpdateError(errorText || "Failed to update profile");
        setIsUpdatingProfile(false);
        return;
      }

      const responseText = await response.text();
      console.log('Raw update response:', responseText);
      
      let updatedProfileData;
      try {
        updatedProfileData = JSON.parse(responseText);
        console.log('Parsed update response:', updatedProfileData);
      } catch (parseError) {
        console.error('Error parsing update response:', parseError);
        throw new Error('Invalid response format from server');
      }

      // Format the date for display
      if (updatedProfileData.dateOfBirth) {
        console.log('Original updated dateOfBirth:', updatedProfileData.dateOfBirth);
        updatedProfileData.dateOfBirth = formatDateForDisplay(updatedProfileData.dateOfBirth);
        console.log('Formatted updated dateOfBirth for display:', updatedProfileData.dateOfBirth);
      }

      setStudentProfile(updatedProfileData);
      setProfileUpdateError(null);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setProfileUpdateError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar
        items={sidebarItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        logoIcon={<GraduationCap size={20} />}
        logoText="UniVast"
        onLogout={handleLogout}
      />

      <div className="flex-1 overflow-y-auto">
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
                                {university.logo ? (
                                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                                  <img
                                      src={`${API_BASE_URL}/api/universities/uploads/logos/${university.logo}`}
                                    alt={`${university.name} logo`}
                                    className="w-16 h-16 object-contain"
                                  />
                                </div>
                                ) : (
                                  <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
                                    <span className="text-2xl font-semibold text-purple-600">
                                      {getInitials(university.name)}
                                    </span>
                                  </div>
                                )}
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
                              <div className="flex space-x-2 mt-4">
                                {/* View Programs Button */}
                              <Button 
                                  className="flex-1"
                                onClick={() => {
                                    setSelectedUniversity(university.id.toString());
                                    setActiveTab("programs");
                                }}
                              >
                                View Programs
                              </Button>
                                {/* View Profile Button */}
                                <Button 
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => handleViewProfile(university.id)}
                                >
                                  View Profile
                              </Button>
                              </div>
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
                      {myApplications.map((application) => (
                        <Card key={application.id}>
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {application.program?.name || 'Program'}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {application.program?.university?.name || 'Unknown University'}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                  Applied on: {formatDate(application.submissionDate)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Last Updated: {formatDate(application.lastUpdated)}
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
                                {application.uploadedFilePath && (
                                  <div className="mt-2">
                                    <a 
                                      href={`${API_BASE_URL}/api/applications/files/${application.id}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-purple-600 hover:underline text-sm font-medium"
                                    >
                                      View Uploaded File
                                    </a>
                                  </div>
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
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "profile" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
                  {isFetchingProfile ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                  ) : profileFetchError ? (
                    <div className="text-red-600">{profileFetchError}</div>
                  ) : studentProfile && (
                    <Card>
                      <CardContent className="p-6">
                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={studentProfile.profilePicture || "/placeholder.svg"}
                              alt={`${studentProfile.firstName} ${studentProfile.lastName}'s profile picture`}
                              className="w-20 h-20 rounded-full object-cover"
                            />
                            <div className="space-y-1">
                              <Label htmlFor="profilePicture">Profile Picture</Label>
                              <Input
                                id="profilePicture"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  // Handle file change and potentially create a preview URL
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    // For display purposes, you might want a preview
                                    // setStudentProfile(prev => ({ ...prev!, profilePicture: URL.createObjectURL(file) }));
                                    // For actual upload, you'll handle this in the save function
                                    console.log('Profile picture selected:', file.name);
                                  }
                                }}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First Name</Label>
                              <Input id="firstName" value={studentProfile.firstName} onChange={(e) => setStudentProfile(prev => ({ ...prev!, firstName: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input id="lastName" value={studentProfile.lastName} onChange={(e) => setStudentProfile(prev => ({ ...prev!, lastName: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input id="email" type="email" value={studentProfile.email} onChange={(e) => setStudentProfile(prev => ({ ...prev!, email: e.target.value }))} disabled />
                            </div>
                             <div className="space-y-2">
                              <Label htmlFor="gpa">GPA</Label>
                              <Input id="gpa" type="number" step="0.01" value={studentProfile.gpa || ''} onChange={(e) => setStudentProfile(prev => ({ ...prev!, gpa: parseFloat(e.target.value) || undefined }))} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="dateOfBirth">Date of Birth</Label>
                              <Input id="dateOfBirth" type="date" value={studentProfile.dateOfBirth || ''} onChange={(e) => setStudentProfile(prev => ({ ...prev!, dateOfBirth: e.target.value }))} />
                            </div>
                             <div className="space-y-2">
                              <Label htmlFor="location">Location</Label>
                              <Input id="location" value={studentProfile.location || ''} onChange={(e) => setStudentProfile(prev => ({ ...prev!, location: e.target.value }))} />
                            </div>
                          </div>
                           <div className="space-y-2">
                              <Label htmlFor="educationBackground">Education Background</Label>
                              <Textarea id="educationBackground" value={studentProfile.educationBackground || ''} onChange={(e) => setStudentProfile(prev => ({ ...prev!, educationBackground: e.target.value }))} rows={4} />
                            </div>
                          {/* Add Bio field */}
                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                              id="bio"
                              value={studentProfile?.bio || ''}
                              onChange={(e) => setStudentProfile(prev => prev ? { ...prev, bio: e.target.value } : null)}
                              placeholder="Tell us about yourself..."
                              className="border-purple-100"
                              rows={4}
                            />
                          </div>
                           {profileUpdateError && (
                            <div className="text-red-500 text-sm mt-2">{profileUpdateError}</div>
                          )}

                          {/* Add more editable fields here */}

                           <Button type="submit">Save Profile</Button>
                        </form>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Add this dialog component */}
          <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {hasAlreadyApplied ? "Already Applied" : "Apply to Program"}
                </DialogTitle>
                <DialogDescription>
                  {hasAlreadyApplied 
                    ? "You have already applied to this program."
                    : "Fill out the application form below."}
                </DialogDescription>
              </DialogHeader>
              {hasAlreadyApplied ? (
                <div className="flex justify-end">
                  <Button onClick={() => setIsApplyDialogOpen(false)}>
                    Close
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
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
                  </div>
                  <div>
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
                  </div>
                  {applicationError && (
                    <div className="text-sm text-red-600">
                      {applicationError}
                    </div>
                  )}
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsApplyDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => {
                        if (selectedProgram) {
                          handleApply(selectedProgram.id);
                          setIsApplyDialogOpen(false);
                        }
                      }}
                      disabled={isApplying || !personalStatement.trim()}
                    >
                      {isApplying ? "Submitting..." : "Submit Application"}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* University Profile Dialog */}
          <Dialog open={isUniversityProfileDialogOpen} onOpenChange={setIsUniversityProfileDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{viewedUniversity?.name || 'University Profile'}</DialogTitle>
                <DialogDescription>
                  Details about this university.
                </DialogDescription>
              </DialogHeader>
              {isFetchingUniversityProfile ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                </div>
              ) : fetchUniversityProfileError ? (
                <div className="text-red-600">{fetchUniversityProfileError}</div>
              ) : viewedUniversity ? (
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-center">
                    {viewedUniversity.logo ? (
                      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                        <img
                          src={`${API_BASE_URL}/api/universities/uploads/logos/${viewedUniversity.logo}`}
                          alt={`${viewedUniversity.name} logo`}
                          className="w-20 h-20 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-3xl font-semibold text-purple-600">
                          {getInitials(viewedUniversity.name)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900">{viewedUniversity.name}</h3>
                    <p className="text-gray-600">{viewedUniversity.location}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">Website:</p>
                      <p className="text-sm text-gray-900">
                        <a href={viewedUniversity.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                          {viewedUniversity.website || 'N/A'}
                        </a>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">Phone:</p>
                      <p className="text-sm text-gray-900">{viewedUniversity.phoneNumber || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">Founded Year:</p>
                      <p className="text-sm text-gray-900">{viewedUniversity.foundedYear || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">Accreditation:</p>
                      <p className="text-sm text-gray-900">{viewedUniversity.accreditation || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">Acceptance Rate:</p>
                      <p className="text-sm text-gray-900">{viewedUniversity.acceptanceRate != null ? `${viewedUniversity.acceptanceRate}%` : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">Description:</p>
                    <p className="text-sm text-gray-900">{viewedUniversity.description || 'N/A'}</p>
                  </div>
                </div>
              ) : null}
              <DialogFooter>
                <Button onClick={() => setIsUniversityProfileDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
} 