"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function FinancialAidManagement() {
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [scholarshipAmount, setScholarshipAmount] = useState("")
  const [grantAmount, setGrantAmount] = useState("")

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/admin/students")
      if (response.ok) {
        const data = await response.json()
        setStudents(data)
      } else {
        console.error("Failed to fetch students")
      }
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStudent) return

    try {
      const response = await fetch(`/api/admin/financial-aid/${selectedStudent.userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scholarshipAmount: Number.parseFloat(scholarshipAmount),
          grantAmount: Number.parseFloat(grantAmount),
        }),
      })

      if (response.ok) {
        alert("Financial aid updated successfully")
        setScholarshipAmount("")
        setGrantAmount("")
        setSelectedStudent(null)
        fetchStudents()
      } else {
        alert("Failed to update financial aid")
      }
    } catch (error) {
      console.error("Error updating financial aid:", error)
      alert("Error updating financial aid")
    }
  }

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Scholarship</TableHead>
            <TableHead>Grant</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.userId}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>${student.financialAid?.scholarshipAmount || 0}</TableCell>
              <TableCell>${student.financialAid?.grantAmount || 0}</TableCell>
              <TableCell>
                <Button onClick={() => setSelectedStudent(student)}>Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedStudent && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold">Edit Financial Aid for {selectedStudent.name}</h2>
          <div>
            <Label htmlFor="scholarshipAmount">Scholarship Amount</Label>
            <Input
              id="scholarshipAmount"
              type="number"
              value={scholarshipAmount}
              onChange={(e) => setScholarshipAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="grantAmount">Grant Amount</Label>
            <Input
              id="grantAmount"
              type="number"
              value={grantAmount}
              onChange={(e) => setGrantAmount(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Update Financial Aid</Button>
        </form>
      )}
    </div>
  )
}

