"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from "next/link"

export function AdminDashboard({ user }) {
  const [applicationCount, setApplicationCount] = useState(0)

  useEffect(() => {
    // TODO: Fetch application count from Vercel Blob Storage
    // For now, we'll use a placeholder count
    setApplicationCount(10)
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, Admin {user.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Email: {user.email}</p>
          <p>Pending Applications: {applicationCount}</p>
        </CardContent>
      </Card>
      <div className="flex space-x-4">
        <Button asChild>
          <Link href="/admin/applications">Review Applications</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/financial-aid">Manage Financial Aid</Link>
        </Button>
      </div>
    </div>
  )
}

