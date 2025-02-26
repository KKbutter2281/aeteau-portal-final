"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DocumentUpload() {
  const { data: session } = useSession()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file || !session?.user?.email) return

    setUploading(true)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("userId", session.user.email)

    try {
      const response = await fetch("/api/upload-document", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        alert("Document uploaded successfully")
        setFile(null)
      } else {
        alert("Failed to upload document")
      }
    } catch (error) {
      console.error("Error uploading document:", error)
      alert("Error uploading document")
    }

    setUploading(false)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="document">Select Document</Label>
        <Input id="document" type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
      </div>
      <Button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload Document"}
      </Button>
    </div>
  )
}

