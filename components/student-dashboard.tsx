"use client"

import { User } from "@clerk/nextjs/server"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface StudentDashboardProps {
  user: User
  applicationStatus: string
  userData: {
    personalInfo?: {
      fullName?: string
      highSchool?: string
      graduationYear?: string
    }
  }
}

export function StudentDashboard({ user, applicationStatus, userData }: StudentDashboardProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <dt className="font-semibold">Name</dt>
            <dd>{userData.personalInfo?.fullName || "Not provided"}</dd>
            <dt className="font-semibold">High School</dt>
            <dd>{userData.personalInfo?.highSchool || "Not provided"}</dd>
            <dt className="font-semibold">Email</dt>
            <dd>{user.emailAddresses[0].emailAddress}</dd>
          </dl>
          <Button asChild className="mt-4">
            <Link href="/profile">Edit Profile</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-lg font-medium">
              Status: {applicationStatus || "Not Started"}
            </p>
            <Button asChild>
              <Link href="/application">
                {applicationStatus ? "View Application" : "Start Application"}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}