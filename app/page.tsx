import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, University, Cog, MapPin, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import LandingNavbar from "@/components/landing-navbar"

export default function LandingPage() {
  // Mock data that would come from the backend
  const stats = {
    universitiesCount: "100+",
    programsCount: "500+",
    studentsCount: "5,000+",
    successRate: "92%",
  }

  const featuredUniversities = [
    {
      name: "Harvard University",
      location: "Cambridge, MA",
      programCount: "120",
      logo: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Stanford University",
      location: "Stanford, CA",
      programCount: "95",
      logo: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Massachusetts Institute of Technology",
      location: "Cambridge, MA",
      programCount: "85",
      logo: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "University of Oxford",
      location: "Oxford, UK",
      programCount: "110",
      logo: "/placeholder.svg?height=80&width=80",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-purple-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-purple-800">
                Your Gateway to Higher Education
              </h1>
              <p className="max-w-[600px] text-gray-600 md:text-xl">
                Connect with top universities, discover programs that match your interests, and apply with confidence.
                UniVast simplifies your educational journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link href="/auth">
                  <Button className="bg-purple-600 hover:bg-purple-700">Get Started</Button>
                </Link>
                <Link href="#how-it-works">
                  <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">

            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="flex flex-col items-center justify-center p-6 bg-purple-50 rounded-lg">
              <div className="text-3xl md:text-4xl font-bold text-purple-800">{stats.universitiesCount}</div>
              <div className="text-gray-600 font-medium">Universities</div>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-purple-50 rounded-lg">
              <div className="text-3xl md:text-4xl font-bold text-purple-800">{stats.programsCount}</div>
              <div className="text-gray-600 font-medium">Programs</div>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-purple-50 rounded-lg">
              <div className="text-3xl md:text-4xl font-bold text-purple-800">{stats.studentsCount}</div>
              <div className="text-gray-600 font-medium">Students</div>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-purple-50 rounded-lg">
              <div className="text-3xl md:text-4xl font-bold text-purple-800">{stats.successRate}</div>
              <div className="text-gray-600 font-medium">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white" id="features">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">
              Platform Features
            </h2>
            <p className="mt-4 text-gray-600 md:text-xl">
              Discover how UniVast makes education accessible for everyone
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {/* For Students */}
            <Card className="border-purple-100">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-purple-100 mb-4">
                    <GraduationCap className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-800 mb-4">For Students</h3>
                  <ul className="space-y-3 mb-6 text-left">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Discover programs matching your interests</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Apply to multiple universities in one place</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Track application status in real-time</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Save favorite programs for later</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Receive personalized recommendations</span>
                    </li>
                  </ul>
                  <Link href="/auth?type=student">
                    <Button className="bg-purple-600 hover:bg-purple-700 w-full">Join as Student</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* For Universities */}
            <Card className="border-purple-100">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-purple-100 mb-4">
                    <University className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-800 mb-4">For Universities</h3>
                  <ul className="space-y-3 mb-6 text-left">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Showcase your programs to qualified students</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Manage applications efficiently</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Communicate directly with applicants</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Access detailed analytics and insights</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Streamline the admission process</span>
                    </li>
                  </ul>
                  <Link href="/auth?type=university">
                    <Button className="bg-purple-600 hover:bg-purple-700 w-full">Join as University</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* For Administrators */}
            <Card className="border-purple-100">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-purple-100 mb-4">
                    <Cog className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-800 mb-4">For Administrators</h3>
                  <ul className="space-y-3 mb-6 text-left">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Comprehensive platform management</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Monitor user activities and engagement</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Generate detailed reports and statistics</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Ensure data security and compliance</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Customize platform settings</span>
                    </li>
                  </ul>
                  <Link href="/contact">
                    <Button className="bg-purple-600 hover:bg-purple-700 w-full">Contact Us</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-purple-50" id="how-it-works">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">
              How It Works
            </h2>
            <p className="mt-4 text-gray-600 md:text-xl">Your educational journey made simple in just a few steps</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-600 text-white font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-purple-800 mb-2">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up and build your educational profile with your academic background, interests, and achievements.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-600 text-white font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-purple-800 mb-2">Discover Programs</h3>
              <p className="text-gray-600">
                Browse through hundreds of programs from top universities filtered according to your preferences.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-600 text-white font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-purple-800 mb-2">Apply with Ease</h3>
              <p className="text-gray-600">
                Submit applications to multiple programs with our streamlined application process.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-600 text-white font-bold mb-4">
                4
              </div>
              <h3 className="text-xl font-bold text-purple-800 mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your application status in real-time and receive updates from universities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Universities Section */}
      <section className="py-16 bg-white" id="universities">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">
              Featured Universities
            </h2>
            <p className="mt-4 text-gray-600 md:text-xl">Join these prestigious institutions on our platform</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredUniversities.map((university, index) => (
              <Card key={index} className="border-purple-100">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 mb-4 rounded-full bg-purple-50 flex items-center justify-center">
                      <img
                        src={university.logo || "/placeholder.svg"}
                        alt={`${university.name} logo`}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-purple-800 mb-2">{university.name}</h3>
                    <p className="text-gray-600 flex items-center justify-center mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{university.location}</span>
                    </p>
                    <p className="text-gray-600">{university.programCount} Programs</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/auth">
              <Button className="bg-purple-600 hover:bg-purple-700">Join UniVast</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-purple-50" id="testimonials">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">
              Success Stories
            </h2>
            <p className="mt-4 text-gray-600 md:text-xl">
              Hear from students and universities who have achieved their goals with UniVast
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Tabs defaultValue="testimonial1" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-white">
                  <TabsTrigger
                    value="testimonial1"
                    className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
                  >
                    Student
                  </TabsTrigger>
                  <TabsTrigger
                    value="testimonial2"
                    className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
                  >
                    University
                  </TabsTrigger>
                  <TabsTrigger
                    value="testimonial3"
                    className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
                  >
                    Director
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="testimonial1">
                <Card className="border-purple-100">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-6">
                        <p className="text-gray-600 italic text-lg">
                          "UniVast made my application process so much easier. I was able to apply to multiple
                          universities and track everything in one place. I'm now studying at my dream university!"
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-purple-200 mr-4">
                          <img
                            src="/placeholder.svg?height=48&width=48"
                            alt="Student avatar"
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-purple-800">Sarah Johnson</h4>
                          <p className="text-gray-600">Computer Science Student</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="testimonial2">
                <Card className="border-purple-100">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-6">
                        <p className="text-gray-600 italic text-lg">
                          "As a university administrator, UniVast has streamlined our admission process significantly.
                          We've seen a 40% increase in qualified applicants since joining the platform."
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-purple-200 mr-4">
                          <img
                            src="/placeholder.svg?height=48&width=48"
                            alt="Admin avatar"
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-purple-800">Dr. Michael Chen</h4>
                          <p className="text-gray-600">Admissions Director</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="testimonial3">
                <Card className="border-purple-100">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-6">
                        <p className="text-gray-600 italic text-lg">
                          "The platform's analytics have given us valuable insights into student preferences and trends.
                          This has helped us tailor our programs to better meet student needs."
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-purple-200 mr-4">
                          <img
                            src="/placeholder.svg?height=48&width=48"
                            alt="University admin avatar"
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-purple-800">Prof. Emily Rodriguez</h4>
                          <p className="text-gray-600">University Program Director</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            <div className="flex justify-center mt-6 space-x-2">
              <Button variant="outline" size="icon" className="rounded-full border-purple-200">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous testimonial</span>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-purple-200">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next testimonial</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white" id="faq">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-gray-600 md:text-xl">Find answers to common questions about UniVast</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            <FaqItem
              question="Is UniVast free for students?"
              answer="Yes, UniVast is completely free for students. You can create an account, browse universities and programs, and submit applications without any cost."
            />
            <FaqItem
              question="How do universities join the platform?"
              answer="Universities can sign up for an account and complete their profile. Our team will verify the information and activate the account. There are different subscription plans available for universities based on their needs."
            />
            <FaqItem
              question="Can I apply to multiple programs simultaneously?"
              answer="One of the key benefits of UniVast is the ability to apply to multiple programs across different universities with a single profile. This saves you time and helps you manage all your applications in one place."
            />
            <FaqItem
              question="How do I track my application status?"
              answer="Once you've submitted applications, you can track their status in real-time from your student dashboard. You'll also receive email notifications when there are updates to your applications."
            />
            <FaqItem
              question="Is my personal information secure?"
              answer="Yes, we take data security very seriously. All personal information is encrypted and stored securely. We comply with data protection regulations and never share your information with third parties without your consent."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Ready to Start Your Educational Journey?
            </h2>
            <p className="mb-8 text-lg opacity-90">Join thousands of students and universities on UniVast today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button className="bg-white text-purple-700 hover:bg-gray-100">Sign Up Now</Button>
              </Link>
              <Link href="/auth?tab=login">
                <Button variant="outline" className="border-white text-white hover:bg-purple-700">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-purple-100 py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-2">
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold text-purple-800">UniVast</span>
              </div>
              <p className="text-gray-600 mb-4">Connecting students with educational opportunities worldwide.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-purple-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-purple-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-purple-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-purple-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-purple-800 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-600 hover:text-purple-600">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#universities" className="text-gray-600 hover:text-purple-600">
                    Universities
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-gray-600 hover:text-purple-600">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-gray-600 hover:text-purple-600">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-purple-800 mb-4">For Students</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/auth?type=student" className="text-gray-600 hover:text-purple-600">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/auth?tab=login" className="text-gray-600 hover:text-purple-600">
                    Log In
                  </Link>
                </li>
                <li>
                  <Link href="/browse-programs" className="text-gray-600 hover:text-purple-600">
                    Browse Programs
                  </Link>
                </li>
                <li>
                  <Link href="/application-guide" className="text-gray-600 hover:text-purple-600">
                    Application Guide
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-purple-800 mb-4">For Universities</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/auth?type=university" className="text-gray-600 hover:text-purple-600">
                    Join as University
                  </Link>
                </li>
                <li>
                  <Link href="/university-pricing" className="text-gray-600 hover:text-purple-600">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/university-resources" className="text-gray-600 hover:text-purple-600">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-purple-600">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-100 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} UniVast. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link href="/privacy-policy" className="text-gray-600 hover:text-purple-600">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-gray-600 hover:text-purple-600">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border border-purple-100 rounded-lg overflow-hidden">
      <details className="group">
        <summary className="flex cursor-pointer items-center justify-between bg-white p-4 text-lg font-medium text-purple-800">
          {question}
          <svg
            className="h-5 w-5 transition-transform group-open:rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="border-t border-purple-100 p-4 text-gray-600">
          <p>{answer}</p>
        </div>
      </details>
    </div>
  )
}
