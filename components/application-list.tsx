"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

export function ApplicationList() {
  const [applications, setApplications] = useState([])

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/admin/applications")
      if (response.ok) {
        const data = await response.json()
        setApplications(data)
      } else {
        console.error("Failed to fetch applications")
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Submitted At</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((app) => (
          <TableRow key={app.userId}>
            <TableCell>{app.name}</TableCell>
            <TableCell>{new Date(app.submittedAt).toLocaleString()}</TableCell>
            <TableCell>{app.status}</TableCell>
            <TableCell>
              <Button asChild>
                <Link href={`/admin/applications/${app.userId}`}>Review</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

