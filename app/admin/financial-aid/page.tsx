import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { FinancialAidManagement } from "@/components/financial-aid-management"

export default async function AdminFinancialAidPage() {
  const session = await getServerSession()

  if (!session || session.user?.role !== "admin") {
    redirect("/login")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Manage Financial Aid</h1>
      <FinancialAidManagement />
    </div>
  )
}

