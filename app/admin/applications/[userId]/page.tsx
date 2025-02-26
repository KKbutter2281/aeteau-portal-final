import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { ApplicationReview } from "@/components/application-review"

export default async function AdminApplicationReviewPage({ params }: { params: { userId: string } }) {
  const session = await getServerSession()

  if (!session || session.user?.role !== "admin") {
    redirect("/login")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Review Application</h1>
      <ApplicationReview userId={params.userId} />
    </div>
  )
}

