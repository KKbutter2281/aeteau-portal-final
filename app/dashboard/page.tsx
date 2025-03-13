"use client"

import { useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { StudentDashboard } from "@/components/student-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!isSignedIn || !user) {
    redirect("/sign-in")
  }

  // Access metadata from user object
  const role = user.publicMetadata.role as "student" | "admin"
  const applicationStatus = user.publicMetadata.applicationStatus as string
  const userData = user.unsafeMetadata as {
    personalInfo?: {
      fullName?: string
      highSchool?: string
      graduationYear?: string
    }
  }

  if (!role) {
    redirect("/onboarding")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      {role === "student" ? (
        <StudentDashboard 
          user={user}
          applicationStatus={applicationStatus}
          userData={userData}
        />
      ) : (
        <AdminDashboard 
          user={user}
        />
      )}
    </div>
  )
}