import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { ApplicationList } from "@/components/application-list"

export default async function AdminApplicationsPage() {
  const session = await getServerSession()

  if (!session || session.user?.role !== "admin") {
    redirect("/login")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Review Applications</h1>
      <ApplicationList />
    </div>
  )
}

