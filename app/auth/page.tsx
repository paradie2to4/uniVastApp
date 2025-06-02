"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap } from "lucide-react"
import Cookies from 'js-cookie'

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("signup")
  const [role, setRole] = useState("")
  const [showStudentFields, setShowStudentFields] = useState(false)
  const [showUniversityFields, setShowUniversityFields] = useState(false)

  // Form data states
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    firstName: "",
    lastName: "",
    universityName: "",
    universityLocation: "",
  })

  const [loginData, setLoginData] = useState({
    loginInput: "",
    loginPassword: "",
  })

  useEffect(() => {
    // Check URL parameters for tab and type
    const tab = searchParams.get("tab")
    const type = searchParams.get("type")

    if (tab === "login") {
      setActiveTab("login")
    }

    if (type === "student") {
      setRole("STUDENT")
      setShowStudentFields(true)
      setShowUniversityFields(false)
      setSignupData((prev) => ({ ...prev, role: "STUDENT" }))
    } else if (type === "university") {
      setRole("UNIVERSITY")
      setShowStudentFields(false)
      setShowUniversityFields(true)
      setSignupData((prev) => ({ ...prev, role: "UNIVERSITY" }))
    }
  }, [searchParams])

  const handleRoleChange = (value: string) => {
    setRole(value)
    setSignupData((prev) => ({ ...prev, role: value }))

    if (value === "STUDENT") {
      setShowStudentFields(true)
      setShowUniversityFields(false)
    } else if (value === "UNIVERSITY") {
      setShowStudentFields(false)
      setShowUniversityFields(true)
    } else {
      setShowStudentFields(false)
      setShowUniversityFields(false)
    }
  }

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignupData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log('Starting signup process...');
      // 1. Register the user
      const response = await fetch("http://localhost:8080/api/users", {
        method: "POST",
<<<<<<< HEAD
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      console.log('Signup response status:', response.status);
      if (!response.ok) {
        throw new Error("Sign-up failed");
=======
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          username: signupData.username,
          email: signupData.email,
          password: signupData.password,
          role: signupData.role,
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          universityName: signupData.universityName,
          universityLocation: signupData.universityLocation
        }),
      });

      console.log('Signup response status:', response.status);
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || "Sign-up failed");
>>>>>>> 47f4fab (Updated with new features)
      }

      // 2. After successful signup, log the user in
      const loginResponse = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
<<<<<<< HEAD
        headers: { "Content-Type": "application/json" },
=======
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
>>>>>>> 47f4fab (Updated with new features)
        body: JSON.stringify({
          username: signupData.username,
          password: signupData.password,
        }),
      });

      console.log('Auto-login response status:', loginResponse.status);
      if (!loginResponse.ok) {
<<<<<<< HEAD
        throw new Error("Auto-login after signup failed");
=======
        const errorData = await loginResponse.json();
        throw new Error(errorData.error || "Auto-login after signup failed");
>>>>>>> 47f4fab (Updated with new features)
      }

      const userData = await loginResponse.json();
      console.log('Auto-login successful, user data:', userData);
<<<<<<< HEAD
      localStorage.setItem("univast_user", JSON.stringify(userData));
      Cookies.set('is_logged_in', 'true', { path: '/' });

      // 3. Redirect based on role
      console.log('Redirecting based on role:', userData.role);
      switch (userData.role) {
=======
      
      // Store JWT token and user data
      const { token, ...userInfo } = userData;
      localStorage.setItem("univast_token", token);
      
      if (userInfo.role === "STUDENT") {
        // Fetch the student profile using the student ID
        const studentProfileRes = await fetch(`http://localhost:8080/api/students/${userInfo.studentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!studentProfileRes.ok) {
          throw new Error("Failed to fetch student profile");
        }
        const studentProfile = await studentProfileRes.json();
        localStorage.setItem("univast_user", JSON.stringify(studentProfile));
      } else {
        localStorage.setItem("univast_user", JSON.stringify(userInfo));
      }
      Cookies.set('is_logged_in', 'true', { path: '/' });

      // Redirecting based on the user role
      console.log('Redirecting based on role:', userInfo.role);
      switch (userInfo.role) {
>>>>>>> 47f4fab (Updated with new features)
        case "STUDENT":
          console.log('Redirecting to student dashboard...');
          router.push("/student-dashboard");
          break;
        case "UNIVERSITY":
          console.log('Redirecting to university dashboard...');
          router.push("/university-dashboard");
          break;
        case "ADMIN":
          console.log('Redirecting to admin dashboard...');
          router.push("/admin-dashboard");
          break;
        default:
          console.log('Unknown role, redirecting to login...');
          router.push("/auth?tab=login");
      }
    } catch (error) {
      console.error("Sign-up error:", error);
<<<<<<< HEAD
      alert("Sign-up failed. Please try again later.");
=======
      alert(error instanceof Error ? error.message : "Sign-up failed. Please try again later.");
>>>>>>> 47f4fab (Updated with new features)
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
<<<<<<< HEAD

    try {
      console.log('Starting login process in auth page...')
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
=======
    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
>>>>>>> 47f4fab (Updated with new features)
        body: JSON.stringify({
          username: loginData.loginInput,
          password: loginData.loginPassword,
        }),
      })

<<<<<<< HEAD
      console.log('Login response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Login API error:', errorText)
        throw new Error(`Login failed: ${response.status} ${response.statusText}`)
      }

      const userData = await response.json()
      console.log('Login successful, user data:', userData)

      // Validate user data
      if (!userData.id || !userData.role) {
        console.error('Invalid user data received:', userData)
        throw new Error('Invalid user data received from server')
      }

      // Store user data in localStorage
      if (userData.role === "STUDENT") {
        // Fetch the student profile using the user ID
        const studentProfileRes = await fetch(`http://localhost:8080/api/students/user/${userData.id}`);
        if (!studentProfileRes.ok) {
          throw new Error("Failed to fetch student profile");
        }
        const studentProfile = await studentProfileRes.json();
        // Store only the student object (with correct student id)
        localStorage.setItem("univast_user", JSON.stringify(studentProfile));
      } else {
        localStorage.setItem("univast_user", JSON.stringify(userData));
      }
      Cookies.set('is_logged_in', 'true', { path: '/' });

      // Redirect based on role
      console.log('Redirecting based on role:', userData.role)
      switch (userData.role) {
        case 'STUDENT':
          console.log('Redirecting to student dashboard...')
          router.push('/student-dashboard')
          break
        case 'UNIVERSITY':
          console.log('Redirecting to university dashboard...')
          router.push('/university-dashboard')
          break
        case 'ADMIN':
          console.log('Redirecting to admin dashboard...')
          router.push('/admin-dashboard')
          break
        default:
          console.error('Unknown user role:', userData.role)
=======
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Login failed')
      }

      const user = await response.json(); // Get the full user object
      console.log("Logged in user data:", user);

      // Store user data and token in local storage
      localStorage.setItem('univast_token', 'fake-jwt-token') // Store the actual token if backend provides one

      // Create a user object to store in local storage, including university details
      const userToStore: any = {
        userId: user.userId,
        role: user.role,
      };

      if (user.role === 'STUDENT' && user.studentId) {
        userToStore.studentId = user.studentId;
        // Fetch student profile data if needed for local storage
        try {
          const studentProfileResponse = await fetch(`http://localhost:8080/api/students/${user.studentId}`, {
             headers: { 'Authorization': `Bearer fake-jwt-token` }
          });
           if (studentProfileResponse.ok) {
              const studentProfile = await studentProfileResponse.json();
              userToStore.firstName = studentProfile.firstName;
              userToStore.lastName = studentProfile.lastName;
               userToStore.profilePicture = studentProfile.profilePicture;
           }
        } catch (fetchError) {
           console.error("Failed to fetch student profile after login:", fetchError);
        }
      } else if (user.role === 'UNIVERSITY' && user.universityId) {
        // Include university-specific data
        userToStore.universityId = user.universityId;
        userToStore.universityName = user.universityName; // Assuming backend provides this
        userToStore.logo = user.logo; // Assuming backend provides this
         userToStore.location = user.location; // Assuming backend provides this
         userToStore.description = user.description; // Assuming backend provides this
         userToStore.website = user.website; // Assuming backend provides this
         userToStore.phoneNumber = user.phoneNumber; // Assuming backend provides this
         userToStore.foundedYear = user.foundedYear; // Assuming backend provides this
         userToStore.accreditation = user.accreditation; // Assuming backend provides this
         userToStore.acceptanceRate = user.acceptanceRate; // Assuming backend provides this
      }

      localStorage.setItem('univast_user', JSON.stringify(userToStore))

      // Redirect based on role
      switch (user.role) {
        case 'STUDENT':
          router.push('/student-dashboard')
          break
        case 'UNIVERSITY':
          router.push('/university-dashboard')
          break
        case 'ADMIN':
          router.push('/admin-dashboard')
          break
        default:
>>>>>>> 47f4fab (Updated with new features)
          router.push('/auth?tab=login')
      }
    } catch (error) {
      console.error("Login error:", error)
<<<<<<< HEAD
      alert("Login failed. Please check your credentials and try again.")
=======
      alert(error instanceof Error ? error.message : "Login failed. Please check your credentials and try again.")
>>>>>>> 47f4fab (Updated with new features)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-purple-100">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mb-2">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-purple-800">UniVast</CardTitle>
          <CardDescription className="text-center text-gray-600">Your gateway to higher education</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
              >
                Sign Up
              </TabsTrigger>
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
              >
                Log In
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signup">
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    required
                    value={signupData.username}
                    onChange={handleSignupChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={signupData.email}
                    onChange={handleSignupChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    required
                    value={signupData.password}
                    onChange={handleSignupChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={handleRoleChange}>
                    <SelectTrigger id="role" className="border-purple-100">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="UNIVERSITY">University</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {showStudentFields && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="Enter your first name"
                        value={signupData.firstName}
                        onChange={handleSignupChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Enter your last name"
                        value={signupData.lastName}
                        onChange={handleSignupChange}
                      />
                    </div>
                  </div>
                )}

                {showUniversityFields && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="universityName">University Name</Label>
                      <Input
                        id="universityName"
                        name="universityName"
                        placeholder="Enter university name"
                        value={signupData.universityName}
                        onChange={handleSignupChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="universityLocation">University Location</Label>
                      <Input
                        id="universityLocation"
                        name="universityLocation"
                        placeholder="Enter university location"
                        value={signupData.universityLocation}
                        onChange={handleSignupChange}
                      />
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                  Register
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginInput">Username or Email</Label>
                  <Input
                    id="loginInput"
                    name="loginInput"
                    placeholder="Enter your username or email"
                    required
                    value={loginData.loginInput}
                    onChange={handleLoginChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loginPassword">Password</Label>
                  <Input
                    id="loginPassword"
                    name="loginPassword"
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={loginData.loginPassword}
                    onChange={handleLoginChange}
                  />
                </div>

                <div className="flex items-center justify-end">
                  <Link href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-800">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                  Log In
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          <div className="mt-6 text-center text-sm">
            <Link href="/" className="text-purple-600 hover:text-purple-800">
              ← Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
