"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function OnboardingPage() {
  const { isLoaded, user } = useUser()
  const router = useRouter()
  const [role, setRole] = useState<"student" | "admin">()
  const [formData, setFormData] = useState({
    fullName: "",
    highSchool: "",
    graduationYear: new Date().getFullYear().toString()
  })

  if (!isLoaded || !user) {
    return <div>Loading...</div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Set public metadata (role)
      await user.update({
        publicMetadata: {
          role,
          applicationStatus: role === "student" ? "not_started" : undefined
        }
      })

      // Set unsafe metadata (user-editable profile info)
      if (role === "student") {
        await user.update({
          unsafeMetadata: {
            personalInfo: formData
          }
        })
      }

      router.push("/dashboard")
    } catch (error) {
      console.error("Error updating user metadata:", error)
    }
  }

  return (
    <div className="container max-w-lg mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to the Portal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label>Select your role</Label>
              <RadioGroup
                value={role}
                onValueChange={(value) => setRole(value as "student" | "admin")}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">I am a Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin">I am an Administrator</Label>
                </div>
              </RadioGroup>
            </div>

            {role === "student" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      fullName: e.target.value 
                    }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="highSchool">High School</Label>
                  <Input
                    id="highSchool"
                    value={formData.highSchool}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      highSchool: e.target.value 
                    }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Input
                    id="graduationYear"
                    type="number"
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 4}
                    value={formData.graduationYear}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      graduationYear: e.target.value 
                    }))}
                    required
                  />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full">
              Complete Setup
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
