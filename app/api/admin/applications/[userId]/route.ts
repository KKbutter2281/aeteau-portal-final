import { NextResponse } from "next/server"
import { put, list } from "@vercel/blob"
import { getServerSession } from "next-auth/next"

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const session = await getServerSession()

  if (!session || session.user?.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const { userId } = params

  try {
    const { blobs } = await list({ prefix: `applications/${userId}` })
    if (blobs.length === 0) {
      return new Response(JSON.stringify({ error: "Application not found" }), { status: 404 })
    }
    const applicationBlob = blobs[0]
    const application = JSON.parse(await applicationBlob.text())

    return new Response(JSON.stringify(application))
  } catch (error) {
    console.error("Error fetching application:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch application" }), { status: 500 })
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
    const { blobs } = await list({ prefix: `applications/${userId}` })
    if (blobs.length === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }
    const applicationBlob = blobs[0]
    const application = JSON.parse(await applicationBlob.text())
    application.status = decision
    application.adminComments = comments
    await put(`applications/${userId}/${applicationBlob.pathname.split("/").pop()}`, JSON.stringify(application), {
      contentType: "application/json",
    })

    // Update application index
    const indexBlob = await list({ prefix: "applications/index" })
    if (indexBlob.blobs.length === 0) {
      return NextResponse.json({ error: "Application index not found" }, { status: 404 })
    }
    const indexFile = indexBlob.blobs[0]
    let index = JSON.parse(await indexFile.text())
    index = index.map((app) => {
      if (app.userId === userId) {
        app.status = decision
      }
      return app
    })
    await put(`applications/index/${indexFile.pathname.split("/").pop()}`, JSON.stringify(index), {
      contentType: "application/json",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}

