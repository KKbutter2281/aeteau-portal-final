import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getServerSession } from "next-auth/next"
import { get } from "@vercel/blob"

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await request.json()
  const userId = session.user.email

  try {
    // Store application data in Vercel Blob Storage
    await put(`applications/${userId}.json`, JSON.stringify(data), {
      contentType: "application/json",
    })

    // Update application index
    const indexBlob = await get("applications/index.json")
    const index = indexBlob ? JSON.parse(await indexBlob.text()) : []
    index.push({
      userId,
      name: data.name,
      submittedAt: new Date().toISOString(),
      status: "pending",
    })
    await put("applications/index.json", JSON.stringify(index), {
      contentType: "application/json",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error submitting application:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}

