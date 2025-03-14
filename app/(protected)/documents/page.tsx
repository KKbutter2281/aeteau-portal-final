import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DocumentUpload } from "@/components/document-upload"

export default async function DocumentsPage() {
  const { userId } = auth()
  const user = await currentUser()

  if (!userId || !user) {
    redirect("/sign-in")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground">Upload and manage your application documents.</p>
      </div>

      <DocumentUpload />
    </div>
  )
}

