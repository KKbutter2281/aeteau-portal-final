import { NextResponse } from "next/server"
import { get, put } from "@vercel/blob"
import { getServerSession } from "next-auth/next"

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const session = await getServerSession()

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { userId } = params

  try {
    const applicationBlob = await get(`applications/${userId}.json`)
    const application = JSON.parse(await applicationBlob.text())

    return NextResponse.json(application)
  } catch (error) {
    console.error("Error fetching application:", error)
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { userId: string } }) {
  const session = await getServerSession()

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { userId } = params
  const { decision, comments } = await request.json()

  try {
    // Update application status
    const applicationBlob = await get(`applications/${userId}.json`)
    const application = JSON.parse(await applicationBlob.text())
    application.status = decision
    application.adminComments = comments
    await put(`applications/${userId}.json`, JSON.stringify(application), {
      contentType: "application/json",
    })

    // Update application index
    const indexBlob = await get("applications/index.json")
    let index = JSON.parse(await indexBlob.text())
    index = index.map((app) => {
      if (app.userId === userId) {
        app.status = decision
      }
      return app
    })
    await put("applications/index.json", JSON.stringify(index), {
      contentType: "application/json",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}

