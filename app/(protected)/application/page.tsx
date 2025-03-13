import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ApplicationForm } from "@/components/application-form"

export default async function ApplicationPage() {
  const { userId } = auth()
  const user = await currentUser()

  if (!userId || !user) {
    redirect("/sign-in")
  }

  // In a real app, you would fetch the application data from your database
  // For now, we'll use a placeholder
  const applicationData = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.emailAddresses[0]?.emailAddress || "",
    // Other fields would be populated from your database
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">College Application</h1>
        <p className="text-muted-foreground">Complete all sections of your application below.</p>
      </div>

      <ApplicationForm initialData={applicationData} />
    </div>
  )
}

