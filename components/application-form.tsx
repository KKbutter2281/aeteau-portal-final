"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"

// Define the form schema with Zod
const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 digits"),
  country: z.string().min(1, "Country is required"),
})

const academicInfoSchema = z.object({
  highSchool: z.string().min(1, "High school name is required"),
  graduationYear: z.string().min(1, "Graduation year is required"),
  gpa: z.string().min(1, "GPA is required"),
  satScore: z.string().optional(),
  actScore: z.string().optional(),
  majorInterest: z.string().min(1, "Major of interest is required"),
})

const extracurricularSchema = z.object({
  activities: z.string().optional(),
  honors: z.string().optional(),
  workExperience: z.string().optional(),
  volunteerExperience: z.string().optional(),
})

const personalStatementSchema = z.object({
  statement: z.string().min(100, "Personal statement must be at least 100 characters"),
})

// Combine all schemas
const applicationSchema = z.object({
  personalInfo: personalInfoSchema,
  academicInfo: academicInfoSchema,
  extracurricular: extracurricularSchema,
  personalStatement: personalStatementSchema,
})

type ApplicationFormValues = z.infer<typeof applicationSchema>

export function ApplicationForm({
  initialData = {},
}: {
  initialData?: Partial<ApplicationFormValues["personalInfo"]>
}) {
  const router = useRouter()
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState("personal-info")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with default values
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      personalInfo: {
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        phone: "",
        dateOfBirth: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
      },
      academicInfo: {
        highSchool: "",
        graduationYear: new Date().getFullYear().toString(),
        gpa: "",
        satScore: "",
        actScore: "",
        majorInterest: "",
      },
      extracurricular: {
        activities: "",
        honors: "",
        workExperience: "",
        volunteerExperience: "",
      },
      personalStatement: {
        statement: "",
      },
    },
  })

  async function onSubmit(data: ApplicationFormValues) {
    setIsSubmitting(true)

    try {
      // In a real app, you would send this data to your API
      console.log("Form data:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update user metadata (in a real app)
      // await user?.update({
      //   publicMetadata: {
      //     ...user.publicMetadata,
      //     applicationStatus: "submitted",
      //   },
      // })

      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleTabChange(value: string) {
    // Trigger validation for current tab before switching
    if (activeTab === "personal-info") {
      form.trigger("personalInfo")
    } else if (activeTab === "academic-info") {
      form.trigger("academicInfo")
    } else if (activeTab === "extracurricular") {
      form.trigger("extracurricular")
    }

    setActiveTab(value)
  }

  function handleNext() {
    if (activeTab === "personal-info") {
      form.trigger("personalInfo").then((isValid) => {
        if (isValid) setActiveTab("academic-info")
      })
    } else if (activeTab === "academic-info") {
      form.trigger("academicInfo").then((isValid) => {
        if (isValid) setActiveTab("extracurricular")
      })
    } else if (activeTab === "extracurricular") {
      form.trigger("extracurricular").then((isValid) => {
        if (isValid) setActiveTab("personal-statement")
      })
    }
  }

  function handlePrevious() {
    if (activeTab === "academic-info") {
      setActiveTab("personal-info")
    } else if (activeTab === "extracurricular") {
      setActiveTab("academic-info")
    } else if (activeTab === "personal-statement") {
      setActiveTab("extracurricular")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>College Application Form</CardTitle>
            <CardDescription>Please complete all sections of the application form.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
                <TabsTrigger value="academic-info">Academic Info</TabsTrigger>
                <TabsTrigger value="extracurricular">Extracurricular</TabsTrigger>
                <TabsTrigger value="personal-statement">Personal Statement</TabsTrigger>
              </TabsList>

              <TabsContent value="personal-info" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="personalInfo.firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="personalInfo.lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="personalInfo.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="personalInfo.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="personalInfo.dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalInfo.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="personalInfo.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Anytown" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="personalInfo.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="personalInfo.zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="personalInfo.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="academic-info" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="academicInfo.highSchool"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>High School</FormLabel>
                      <FormControl>
                        <Input placeholder="Anytown High School" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="academicInfo.graduationYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Graduation Year</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 6 }, (_, i) => {
                              const year = new Date().getFullYear() - 2 + i
                              return (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="academicInfo.gpa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GPA</FormLabel>
                        <FormControl>
                          <Input placeholder="4.0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="academicInfo.satScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SAT Score (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="1600" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="academicInfo.actScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ACT Score (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="36" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="academicInfo.majorInterest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intended Major</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a major" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Biology">Biology</SelectItem>
                          <SelectItem value="Psychology">Psychology</SelectItem>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="History">History</SelectItem>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="Undecided">Undecided</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="extracurricular" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="extracurricular.activities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Extracurricular Activities</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List your extracurricular activities, including clubs, sports, and leadership positions."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include organization names, positions held, and years of participation.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="extracurricular.honors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Honors and Awards</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List any honors, awards, or recognitions you have received."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include the name of the award, the organization, and the year received.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="extracurricular.workExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Experience</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe any work experience you have, including part-time jobs, internships, or volunteer positions."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include employer names, positions, dates, and brief descriptions of responsibilities.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="extracurricular.volunteerExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Volunteer Experience</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe any volunteer work or community service you have performed."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include organization names, roles, dates, and impact of your service.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="personal-statement" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="personalStatement.statement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personal Statement</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your personal statement here. This is your opportunity to share your story, goals, and why you want to attend our college."
                          className="min-h-[300px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Your personal statement should be 500-650 words and should highlight your background,
                        experiences, and aspirations.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            {activeTab !== "personal-info" && (
              <Button type="button" variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}

            {activeTab !== "personal-statement" ? (
              <Button type="button" onClick={handleNext} className="ml-auto">
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="ml-auto">
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

