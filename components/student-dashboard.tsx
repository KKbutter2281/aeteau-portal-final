"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from "next/link"

export function StudentDashboard({ user }) {
  const [applicationStatus, setApplicationStatus] = useState(null)
  const [financialAid, setFinancialAid] = useState(null)

  useEffect(() => {
    fetchApplicationStatus()
    fetchFinancialAid()
  }, [])

  const fetchApplicationStatus = async () => {
    try {
      const response = await fetch("/api/application-status")
      if (response.ok) {
        const data = await response.json()
        setApplicationStatus(data.status)
      } else {
        console.error("Failed to fetch application status")
      }
    } catch (error) {
      console.error("Error fetching application status:", error)
    }
  }

  const fetchFinancialAid = async () => {
    try {
      const response = await fetch("/api/financial-aid")
      if (response.ok) {
        const data = await response.json()
        setFinancialAid(data)
      } else {
        console.error("Failed to fetch financial aid information")
      }
    } catch (error) {
      console.error("Error fetching financial aid information:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Email: {user.email}</p>
          <p>Application Status: {applicationStatus || "Not Started"}</p>
        </CardContent>
      </Card>

      {financialAid && (
        <Card>
          <CardHeader>
            <CardTitle>Financial Aid Offer</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Scholarship Amount: ${financialAid.scholarshipAmount}</p>
            <p>Grant Amount: ${financialAid.grantAmount}</p>
            <p>Total Aid: ${financialAid.scholarshipAmount + financialAid.grantAmount}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex space-x-4">
        {applicationStatus === "Not Started" && (
          <Button asChild>
            <Link href="/application">Start Application</Link>
          </Button>
        )}
        <Button asChild variant="outline">
          <Link href="/documents">Upload Documents</Link>
        </Button>
      </div>
    </div>
  )
}

