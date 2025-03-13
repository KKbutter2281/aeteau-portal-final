import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, CheckCircle, Clock, AlertCircle } from "lucide-react"

export default async function DashboardPage() {
  const { userId } = auth()
  const user = await currentUser()

  if (!userId || !user) {
    redirect("/sign-in")
  }

  // This would come from your database in a real application
  const applicationStatus = (user.publicMetadata.applicationStatus as string) || "not_started"
  const applicationProgress = getApplicationProgress(applicationStatus)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.firstName || "Applicant"}! Here's your application status.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Application Status</CardTitle>
            <CardDescription>Your current application status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(applicationStatus)}
                <span className="font-medium">{formatStatus(applicationStatus)}</span>
              </div>
            </div>
            <Progress className="mt-4" value={applicationProgress} />
          </CardContent>
          <CardFooter>
            <Link href="/application" className="w-full">
              <Button className="w-full">
                {applicationStatus === "not_started"
                  ? "Start Application"
                  : applicationStatus === "submitted"
                    ? "View Application"
                    : "Continue Application"}
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Documents</CardTitle>
            <CardDescription>Upload and manage your documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Transcript</span>
                <span className="text-xs text-muted-foreground">Required</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Recommendation Letters</span>
                <span className="text-xs text-muted-foreground">Optional</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Personal Statement</span>
                <span className="text-xs text-muted-foreground">Required</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/documents" className="w-full">
              <Button className="w-full" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Manage Documents
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Important Dates</CardTitle>
            <CardDescription>Keep track of key deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Application Deadline</p>
                  <p className="text-sm text-muted-foreground">Early Decision</p>
                </div>
                <p className="font-medium">Nov 1, 2023</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Application Deadline</p>
                  <p className="text-sm text-muted-foreground">Regular Decision</p>
                </div>
                <p className="font-medium">Jan 15, 2024</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Decision Release</p>
                  <p className="text-sm text-muted-foreground">All Applicants</p>
                </div>
                <p className="font-medium">Apr 1, 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>What you need to do next</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getNextSteps(applicationStatus).map((step, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="mt-0.5 h-5 w-5 text-primary">
                    {step.completed ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Help & Support</CardTitle>
            <CardDescription>Get assistance with your application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-3">
              <h3 className="font-medium">Admissions Office</h3>
              <p className="text-sm text-muted-foreground">
                Contact our admissions team for questions about your application.
              </p>
              <p className="mt-2 text-sm">
                Email: <span className="font-medium">admissions@college.edu</span>
              </p>
              <p className="text-sm">
                Phone: <span className="font-medium">(555) 123-4567</span>
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <h3 className="font-medium">Technical Support</h3>
              <p className="text-sm text-muted-foreground">Having trouble with the application portal?</p>
              <p className="mt-2 text-sm">
                Email: <span className="font-medium">support@college.edu</span>
              </p>
            </div>
            <Button variant="outline" className="w-full">
              View FAQ
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function getApplicationProgress(status: string): number {
  switch (status) {
    case "not_started":
      return 0
    case "in_progress":
      return 40
    case "documents_pending":
      return 70
    case "submitted":
      return 100
    case "under_review":
      return 100
    case "accepted":
      return 100
    case "rejected":
      return 100
    default:
      return 0
  }
}

function formatStatus(status: string): string {
  switch (status) {
    case "not_started":
      return "Not Started"
    case "in_progress":
      return "In Progress"
    case "documents_pending":
      return "Documents Pending"
    case "submitted":
      return "Submitted"
    case "under_review":
      return "Under Review"
    case "accepted":
      return "Accepted"
    case "rejected":
      return "Not Accepted"
    default:
      return "Unknown"
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "not_started":
      return <Clock className="h-5 w-5 text-muted-foreground" />
    case "in_progress":
      return <FileText className="h-5 w-5 text-blue-500" />
    case "documents_pending":
      return <Upload className="h-5 w-5 text-amber-500" />
    case "submitted":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "under_review":
      return <Clock className="h-5 w-5 text-purple-500" />
    case "accepted":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "rejected":
      return <AlertCircle className="h-5 w-5 text-red-500" />
    default:
      return <Clock className="h-5 w-5 text-muted-foreground" />
  }
}

function getNextSteps(status: string) {
  switch (status) {
    case "not_started":
      return [
        {
          title: "Start your application",
          description: "Fill out your personal and academic information",
          completed: false,
        },
        {
          title: "Prepare your documents",
          description: "Gather your transcript and recommendation letters",
          completed: false,
        },
        {
          title: "Write your personal statement",
          description: "Share your story and why you want to attend our college",
          completed: false,
        },
      ]
    case "in_progress":
      return [
        {
          title: "Complete your application",
          description: "Finish filling out all required sections",
          completed: false,
        },
        {
          title: "Upload your documents",
          description: "Submit your transcript and recommendation letters",
          completed: false,
        },
        {
          title: "Review and submit",
          description: "Double-check your application before submitting",
          completed: false,
        },
      ]
    case "documents_pending":
      return [
        {
          title: "Complete your application",
          description: "Fill out your personal and academic information",
          completed: true,
        },
        {
          title: "Upload remaining documents",
          description: "Submit any outstanding required documents",
          completed: false,
        },
        {
          title: "Review and submit",
          description: "Double-check your application before submitting",
          completed: false,
        },
      ]
    case "submitted":
    case "under_review":
      return [
        {
          title: "Application submitted",
          description: "Your application has been received",
          completed: true,
        },
        {
          title: "Application under review",
          description: "Our admissions team is reviewing your application",
          completed: status === "under_review",
        },
        {
          title: "Decision",
          description: "You will be notified of our decision by April 1",
          completed: false,
        },
      ]
    default:
      return [
        {
          title: "Start your application",
          description: "Fill out your personal and academic information",
          completed: false,
        },
      ]
  }
}

