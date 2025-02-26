"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ApplicationReview({ userId }: { userId: string }) {
  const [application, setApplication] = useState(null)
  const [decision, setDecision] = useState("")
  const [comments, setComments] = useState("")

  useEffect(() => {
    fetchApplication()
  }, [])

  const fetchApplication = async () => {
    try {
      const response = await fetch(`/api/admin/applications/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setApplication(data)
      } else {
        console.error("Failed to fetch application")
      }
    } catch (error) {
      console.error("Error fetching application:", error)
    }
  }

  const handleDecision = async (decision: string) => {
    try {
      const response = await fetch(`/api/admin/applications/${userId}/decision`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ decision, comments }),
      })

      if (response.ok) {
        alert("Decision submitted successfully")
        // Refresh application data
        fetchApplication()
      } else {
        alert("Failed to submit decision")
      }
    } catch (error) {
      console.error("Error submitting decision:", error)
      alert("Error submitting decision")
    }
  }

  if (!application) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Applicant Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Name:</strong> {application.name}
          </p>
          <p>
            <strong>Email:</strong> {application.email}
          </p>
          <p>
            <strong>Date of Birth:</strong> {application.dob}
          </p>
          <p>
            <strong>High School:</strong> {application.highSchool}
          </p>
          <p>
            <strong>GPA:</strong> {application.gpa}
          </p>
          <p>
            <strong>SAT Score:</strong> {application.satScore}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Essay</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{application.essay}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Decision</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="comments">Comments</Label>
              <Textarea id="comments" value={comments} onChange={(e) => setComments(e.target.value)} />
            </div>
            <div className="flex space-x-4">
              <Button onClick={() => handleDecision("approve")}>Approve</Button>
              <Button onClick={() => handleDecision("reject")} variant="destructive">
                Reject
              </Button>
              <Button onClick={() => handleDecision("waitlist")} variant="outline">
                Waitlist
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

