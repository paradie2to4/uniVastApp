"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { type Application, ApplicationStatus } from "@/app/api/applications/route"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ApplicationReviewProps {
  application: Application
  onSuccess?: () => void
  onCancel?: () => void
}

export default function ApplicationReview({ application, onSuccess, onCancel }: ApplicationReviewProps) {
  const [status, setStatus] = useState<ApplicationStatus>(application.status)
  const [feedback, setFeedback] = useState(application.feedback || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/applications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: application.id,
          status,
          feedback,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update application")
      }

      setSuccess(true)
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        } else {
          router.push("/university-dashboard?tab=applications")
        }
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="w-full max-w-3xl mx-auto border-purple-100">
      <CardHeader>
        <CardTitle className="text-purple-800">Review Application</CardTitle>
        <CardDescription>
          {application.program.name} • {application.program.university.name}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Application Updated</AlertTitle>
              <AlertDescription>
                The application status has been successfully updated. You will be redirected shortly.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Applicant Information</h3>
            <p className="text-sm text-gray-600">
              <strong>Name:</strong> {application.student.firstName} {application.student.lastName}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {application.student.email}
            </p>
            {application.student.gpa && (
              <p className="text-sm text-gray-600">
                <strong>GPA:</strong> {application.student.gpa}
              </p>
            )}
            <p className="text-sm text-gray-600">
              <strong>Submitted:</strong> {formatDate(application.submissionDate)}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Personal Statement</h3>
            <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700">{application.personalStatement}</div>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Application Status <span className="text-red-500">*</span>
            </label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as ApplicationStatus)}
              disabled={isSubmitting || success}
            >
              <SelectTrigger id="status" className="border-purple-100">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ApplicationStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={ApplicationStatus.REVIEWING}>Reviewing</SelectItem>
                <SelectItem value={ApplicationStatus.ACCEPTED}>Accepted</SelectItem>
                <SelectItem value={ApplicationStatus.REJECTED}>Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="feedback" className="text-sm font-medium">
              Feedback
            </label>
            <Textarea
              id="feedback"
              placeholder="Provide feedback to the applicant (max 500 characters)"
              rows={4}
              maxLength={500}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="border-purple-100"
              disabled={isSubmitting || success}
            />
            <p className="text-xs text-gray-500 text-right">{feedback.length}/500 characters</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || success}
            className="border-purple-200"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || success} className="bg-purple-600 hover:bg-purple-700">
            {isSubmitting ? "Updating..." : "Update Application"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
