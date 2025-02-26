import { NextResponse } from "next/server"
import { get } from "@vercel/blob"
import { getServerSession } from "next-auth/next"

export async function GET() {
  const session = await getServerSession()

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.email

  try {
    const indexBlob = await get("applications/index.json")
    const applications = JSON.parse(await indexBlob.text())
    const application = applications.find((app) => app.userId === userId)

    if (application) {
      return NextResponse.json({ status: application.status })
    } else {
      return NextResponse.json({ status: "Not Started" })
    }
  } catch (error) {
    console.error("Error fetching application status:", error)
    return NextResponse.json({ error: "Failed to fetch application status" }, { status: 500 })
  }
}

