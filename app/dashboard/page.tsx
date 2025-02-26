import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { StudentDashboard } from "@/components/student-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session || !session.user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      {session.user.role === "student" ? (
        <StudentDashboard user={session.user} />
      ) : (
        <AdminDashboard user={session.user} />
      )}
    </div>
  )
}

