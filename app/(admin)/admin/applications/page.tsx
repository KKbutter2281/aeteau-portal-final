import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Sample data - in a real app, this would come from your database
const applications = [
  {
    id: "APP-1234",
    name: "John Smith",
    email: "john.smith@example.com",
    submittedAt: "2023-10-15T14:30:00Z",
    status: "pending",
    major: "Computer Science",
  },
  {
    id: "APP-1235",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    submittedAt: "2023-10-14T09:15:00Z",
    status: "under_review",
    major: "Business",
  },
  {
    id: "APP-1236",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    submittedAt: "2023-10-13T16:45:00Z",
    status: "accepted",
    major: "Engineering",
  },
  {
    id: "APP-1237",
    name: "Sarah Davis",
    email: "sarah.davis@example.com",
    submittedAt: "2023-10-12T11:20:00Z",
    status: "rejected",
    major: "Biology",
  },
  {
    id: "APP-1238",
    name: "David Wilson",
    email: "david.wilson@example.com",
    submittedAt: "2023-10-11T13:10:00Z",
    status: "pending",
    major: "Psychology",
  },
]

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">Manage and review student applications.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Export</Button>
          <Button>Bulk Actions</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Filters</CardTitle>
          <CardDescription>Filter applications by status, major, or search by name/email.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Major</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Filter by major" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Majors</SelectItem>
                  <SelectItem value="computer_science">Computer Science</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="psychology">Psychology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Search</label>
              <Input placeholder="Search by name or email" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
          <CardDescription>Showing {applications.length} applications</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Major</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.id}</TableCell>
                  <TableCell>{application.name}</TableCell>
                  <TableCell>{application.email}</TableCell>
                  <TableCell>{formatDate(application.submittedAt)}</TableCell>
                  <TableCell>{application.major}</TableCell>
                  <TableCell>
                    <StatusBadge status={application.status} />
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/applications/${application.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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

