import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, Download, FileText } from "lucide-react"

// Sample data - in a real app, this would come from your database
const application = {
  id: "APP-1234",
  status: "pending",
  submittedAt: "2023-10-15T14:30:00Z",
  personalInfo: {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    dateOfBirth: "2005-06-15",
    address: "123 Main St",
    city: "Anytown",
    state: "CA",
    zipCode: "12345",
    country: "United States",
  },
  academicInfo: {
    highSchool: "Anytown High School",
    graduationYear: "2023",
    gpa: "3.85",
    satScore: "1480",
    actScore: "32",
    majorInterest: "Computer Science",
  },
  extracurricular: {
    activities:
      "Robotics Club (President, 2021-2023)\nDebate Team (2020-2023)\nVolunteer at Local Food Bank (2019-2023)",
    honors: "National Merit Scholar\nAP Scholar with Distinction\nFirst Place in Regional Science Fair",
    workExperience: "Summer Intern at Tech Solutions Inc. (2022)\nPart-time Cashier at Local Grocery (2020-2021)",
    volunteerExperience: "Volunteer at Local Food Bank (100+ hours)\nTutor for underprivileged students (50+ hours)",
  },
  personalStatement: {
    statement:
      "My journey into computer science began when I was twelve years old and my father brought home our first computer. I was immediately fascinated by how it worked and spent countless hours learning to program. This early exposure to technology sparked a passion that has only grown stronger over the years.\n\nIn high school, I founded our school's Robotics Club to share my enthusiasm with others. Leading the club taught me valuable lessons in teamwork, problem-solving, and perseverance. Our team's success at regional competitions demonstrated that with dedication and collaboration, we could overcome significant challenges.\n\nI'm particularly interested in artificial intelligence and its potential to solve real-world problems. My senior project involved developing a machine learning algorithm to predict crop yields based on weather patterns, which could help small farmers in my community make better planting decisions.\n\nI'm excited about the opportunity to study computer science at your university because of its strong emphasis on research and innovation. The chance to work alongside renowned faculty and access cutting-edge resources would be invaluable to my academic and professional growth.\n\nUltimately, I hope to use my education to develop technologies that make a positive impact on society, particularly in areas like sustainable agriculture and environmental protection. I believe that your university would provide the perfect environment for me to pursue these goals.",
  },
  documents: [
    {
      id: "doc-1",
      type: "transcript",
      name: "High School Transcript.pdf",
      uploadedAt: "2023-10-14T10:30:00Z",
      url: "#",
    },
    {
      id: "doc-2",
      type: "recommendation",
      name: "Recommendation Letter - Ms. Johnson.pdf",
      uploadedAt: "2023-10-14T11:15:00Z",
      url: "#",
    },
    {
      id: "doc-3",
      type: "personal-statement",
      name: "Personal Statement.pdf",
      uploadedAt: "2023-10-14T12:00:00Z",
      url: "#",
    },
  ],
  notes: [
    {
      id: "note-1",
      author: "Jane Doe",
      content: "Strong academic record and impressive extracurricular activities.",
      createdAt: "2023-10-16T09:30:00Z",
    },
    {
      id: "note-2",
      author: "Mark Wilson",
      content: "Personal statement shows clear passion for computer science and strong writing skills.",
      createdAt: "2023-10-17T14:15:00Z",
    },
  ],
}

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/admin/applications">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Applications
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Application {params.id}</h1>
          <StatusBadge status={application.status} />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={application.status}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Update Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button>Save Changes</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
            <CardDescription>Submitted on {formatDate(application.submittedAt)}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="statement">Statement</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Full Name</h3>
                    <p>
                      {application.personalInfo.firstName} {application.personalInfo.lastName}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p>{application.personalInfo.email}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p>{application.personalInfo.phone}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Date of Birth</h3>
                    <p>{formatDate(application.personalInfo.dateOfBirth)}</p>
                  </div>
                  <div className="col-span-2">
                    <h3 className="font-medium">Address</h3>
                    <p>
                      {application.personalInfo.address}, {application.personalInfo.city},{" "}
                      {application.personalInfo.state} {application.personalInfo.zipCode},{" "}
                      {application.personalInfo.country}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="academic" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">High School</h3>
                    <p>{application.academicInfo.highSchool}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Graduation Year</h3>
                    <p>{application.academicInfo.graduationYear}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">GPA</h3>
                    <p>{application.academicInfo.gpa}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Intended Major</h3>
                    <p>{application.academicInfo.majorInterest}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">SAT Score</h3>
                    <p>{application.academicInfo.satScore || "Not provided"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">ACT Score</h3>
                    <p>{application.academicInfo.actScore || "Not provided"}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activities" className="space-y-4 pt-4">
                <div>
                  <h3 className="font-medium">Extracurricular Activities</h3>
                  <p className="whitespace-pre-line">{application.extracurricular.activities || "None provided"}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium">Honors and Awards</h3>
                  <p className="whitespace-pre-line">{application.extracurricular.honors || "None provided"}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium">Work Experience</h3>
                  <p className="whitespace-pre-line">{application.extracurricular.workExperience || "None provided"}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium">Volunteer Experience</h3>
                  <p className="whitespace-pre-line">
                    {application.extracurricular.volunteerExperience || "None provided"}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="statement" className="space-y-4 pt-4">
                <div>
                  <h3 className="font-medium">Personal Statement</h3>
                  <p className="whitespace-pre-line">{application.personalStatement.statement}</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Uploaded application documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {application.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">Uploaded on {formatDate(doc.uploadedAt)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={doc.url}>
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Internal notes about this application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {application.notes.map((note) => (
                  <div key={note.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{note.author}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(note.createdAt)}</p>
                    </div>
                    <p className="mt-2 text-sm">{note.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <h3 className="mb-2 font-medium">Add Note</h3>
              <Textarea placeholder="Enter your notes about this application" className="mb-2" />
              <Button>Add Note</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "pending":
      return <Badge variant="outline">Pending</Badge>
    case "under_review":
      return <Badge variant="secondary">Under Review</Badge>
    case "accepted":
      return (
        <Badge variant="default" className="bg-green-500">
          Accepted
        </Badge>
      )
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

