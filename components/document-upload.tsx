"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { upload } from "@vercel/blob/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import { FileText, X, CheckCircle, AlertCircle } from "lucide-react"

// Document types
const documentTypes = [
  {
    id: "transcript",
    name: "Transcript",
    description: "Official high school transcript",
    required: true,
    acceptedFormats: ".pdf,.doc,.docx",
  },
  {
    id: "recommendation",
    name: "Recommendation Letter",
    description: "Letter of recommendation from a teacher or counselor",
    required: false,
    acceptedFormats: ".pdf,.doc,.docx",
  },
  {
    id: "personal-statement",
    name: "Personal Statement",
    description: "Your personal statement essay",
    required: true,
    acceptedFormats: ".pdf,.doc,.docx",
  },
  {
    id: "additional",
    name: "Additional Documents",
    description: "Any additional documents you would like to submit",
    required: false,
    acceptedFormats: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  },
]

export function DocumentUpload() {
  const router = useRouter()
  const { user } = useUser()
  const [uploading, setUploading] = useState<Record<string, boolean>>({})
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [documents, setDocuments] = useState<Record<string, { url: string; filename: string }>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleUpload(documentType: string, file: File) {
    try {
      setUploading({ ...uploading, [documentType]: true })
      setProgress({ ...progress, [documentType]: 0 })
      setErrors({ ...errors, [documentType]: "" })

      // Create a unique filename
      const filename = `${user?.id}-${documentType}-${file.name}`

      // Upload to Vercel Blob
      const response = await upload(filename, file, {
        access: "private",
        handleUploadProgress: (progress) => {
          setProgress((prev) => ({ ...prev, [documentType]: progress }))
        },
      })

      // Update documents state
      setDocuments({
        ...documents,
        [documentType]: { url: response.url, filename: file.name },
      })

      // In a real app, you would save the document reference to your database
      // await saveDocumentReference(user?.id, documentType, response.url, file.name)

      toast({
        title: "Document Uploaded",
        description: `${file.name} has been successfully uploaded.`,
      })
    } catch (error) {
      console.error("Error uploading document:", error)
      setErrors({
        ...errors,
        [documentType]: "Failed to upload document. Please try again.",
      })
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading({ ...uploading, [documentType]: false })
    }
  }

  function handleFileChange(documentType: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(documentType, file)
    }
  }

  function handleRemoveDocument(documentType: string) {
    // In a real app, you would also delete from Vercel Blob
    // await deleteDocument(documents[documentType].url)

    const updatedDocuments = { ...documents }
    delete updatedDocuments[documentType]
    setDocuments(updatedDocuments)

    toast({
      title: "Document Removed",
      description: "The document has been removed.",
    })
  }

  return (
    <div className="space-y-6">
      {documentTypes.map((docType) => (
        <Card key={docType.id}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              {docType.name}
              {docType.required && <span className="ml-2 text-sm text-red-500">*Required</span>}
            </CardTitle>
            <CardDescription>{docType.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {documents[docType.id] ? (
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">{documents[docType.id].filename}</p>
                    <p className="text-sm text-muted-foreground">Uploaded successfully</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveDocument(docType.id)}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            ) : (
              <div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor={`${docType.id}-upload`}>Upload {docType.name}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`${docType.id}-upload`}
                      type="file"
                      accept={docType.acceptedFormats}
                      disabled={uploading[docType.id]}
                      onChange={(e) => handleFileChange(docType.id, e)}
                      className="flex-1"
                    />
                    {uploading[docType.id] && (
                      <Button disabled variant="outline" size="sm">
                        Uploading...
                      </Button>
                    )}
                  </div>
                  {uploading[docType.id] && <Progress value={progress[docType.id] || 0} className="h-2 w-full" />}
                  {errors[docType.id] && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      {errors[docType.id]}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Accepted formats: {docType.acceptedFormats.replace(/\./g, "")}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

