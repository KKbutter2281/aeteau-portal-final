import { NextResponse } from "next/server"
import { auth, clerkClient } from "@clerk/nextjs/server"

export async function POST(request: Request) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()

    // Validate the application data
    if (!data.personalInfo || !data.academicInfo) {
      return NextResponse.json({ error: "Missing required application data" }, { status: 400 })
    }

    // In a real app, you would save the application data to your database
    // await saveApplicationData(userId, data)

    // Update user metadata to reflect application status
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        applicationStatus: "submitted",
        applicationSubmittedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
    })
  } catch (error) {
    console.error("Error submitting application:", error)
    return NextResponse.json({ error: "Error submitting application" }, { status: 500 })
  }
}

