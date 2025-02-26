"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ApplicationForm() {
  const { data: session } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    address: "",
    highSchool: "",
    gpa: "",
    satScore: "",
    essay: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.email) {
      console.error("User not authenticated")
      return
    }

    try {
      const response = await fetch("/api/submit-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.email,
          ...formData,
        }),
      })

      if (response.ok) {
        router.push("/dashboard")
      } else {
        console.error("Failed to submit application")
      }
    } catch (error) {
      console.error("Error submitting application:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="dob">Date of Birth</Label>
        <Input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="highSchool">High School</Label>
        <Input id="highSchool" name="highSchool" value={formData.highSchool} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="gpa">GPA</Label>
        <Input
          id="gpa"
          name="gpa"
          type="number"
          step="0.01"
          min="0"
          max="4"
          value={formData.gpa}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="satScore">SAT Score</Label>
        <Input
          id="satScore"
          name="satScore"
          type="number"
          min="400"
          max="1600"
          value={formData.satScore}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="essay">Personal Essay</Label>
        <Textarea id="essay" name="essay" value={formData.essay} onChange={handleChange} required />
      </div>
      <Button type="submit">Submit Application</Button>
    </form>
  )
}

