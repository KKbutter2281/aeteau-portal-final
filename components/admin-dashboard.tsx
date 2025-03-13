"use client"

import { User } from "@clerk/nextjs/server"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AdminDashboardProps {
  user: User
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Applications Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/admin/applications">View Applications</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button asChild>
              <Link href="/admin/users">Manage Users</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/settings">Settings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}