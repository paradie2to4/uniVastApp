"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import type { Program } from "@/app/api/programs/route"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle2, Upload, X, FileText, Paperclip } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"

interface ApplicationFormProps {
  program: {
    id: number;
    name: string;
    university?: {
      id: number;
      name: string;
    };
    degree: string;
    duration: string;
    tuitionFee: number;
    description: string;
  };
  studentId: number
  studentName: string
  studentEmail: string
  onSuccess?: () => void
  onCancel?: () => void
}

interface UploadedFile {
  name: string
  size: number
  type: string
  file: File
}

export default function ApplicationForm({
  program,
  studentId,
  studentName,
  studentEmail,
  onSuccess,
  onCancel,
}: ApplicationFormProps) {
  const [personalStatement, setPersonalStatement] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: UploadedFile[] = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
      }))

      setUploadedFiles((prev) => [...prev, ...newFiles])

      // Reset the file input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!personalStatement.trim()) {
      setError("Personal statement is required")
      setIsSubmitting(false)
      return
    }

    try {
      const [firstName, lastName] = studentName.split(" ", 2)

      // In a real implementation, we would upload the files to a server
      // For now, we'll just log them and proceed with the application
      console.log("Files to upload:", uploadedFiles)

      // Create FormData for file uploads in a real implementation
      // const formData = new FormData()
      // uploadedFiles.forEach(file => {
      //   formData.append('files', file.file)
      // })

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          studentFirstName: firstName || "",
          studentLastName: lastName || "",
          studentEmail,
          programId: program.id,
          programName: program.name,
          universityId: program.university?.id,
          universityName: program.university?.name,
          personalStatement,
          attachments: uploadedFiles.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
          })),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to submit application")
      }

      setSuccess(true)
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        } else {
          router.push("/dashboard?tab=applications")
        }
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto border-purple-100">
      <CardHeader>
        <CardTitle className="text-purple-800">Apply to {program.name}</CardTitle>
        <CardDescription>
          {program.university?.name || 'Unknown University'} • {program.degree} • {program.duration}
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
              <AlertTitle>Application Submitted</AlertTitle>
              <AlertDescription>
                Your application has been successfully submitted. You will be redirected shortly.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Program Details</h3>
            <p className="text-sm text-gray-600">{program.description}</p>
            <p className="text-sm text-gray-600">
              <strong>Tuition Fee:</strong> ${program.tuitionFee.toLocaleString()} per year
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Applicant Information</h3>
            <p className="text-sm text-gray-600">
              <strong>Name:</strong> {studentName}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {studentEmail}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="personalStatement" className="text-sm font-medium">
              Personal Statement <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="personalStatement"
              placeholder="Tell us why you're interested in this program and why you would be a good fit (max 1000 characters)"
              rows={8}
              maxLength={1000}
              value={personalStatement}
              onChange={(e) => setPersonalStatement(e.target.value)}
              className="border-purple-100"
              required
            />
            <p className="text-xs text-gray-500 text-right">{personalStatement.length}/1000 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileUpload" className="text-sm font-medium">
              Supporting Documents (Optional)
            </Label>
            <div className="border border-dashed border-purple-200 rounded-md p-4 bg-purple-50">
              <div className="flex flex-col items-center justify-center py-4">
                <Upload className="h-8 w-8 text-purple-400 mb-2" />
                <p className="text-sm text-gray-600 mb-1">Drag and drop files here, or click to select files</p>
                <p className="text-xs text-gray-500">Upload transcripts, certificates, or other relevant documents</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 border-purple-200"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting || success}
                >
                  <Paperclip className="mr-2 h-4 w-4" />
                  Select Files
                </Button>
                <input
                  ref={fileInputRef}
                  id="fileUpload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isSubmitting || success}
                />
              </div>
            </div>

            {/* Display uploaded files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Uploaded Files</h4>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-2 rounded-md border border-purple-100"
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-purple-600 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                        onClick={() => removeFile(index)}
                        disabled={isSubmitting || success}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove file</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
