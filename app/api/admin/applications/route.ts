import { NextResponse } from "next/server"
import { get } from "@vercel/blob"
import { getServerSession } from "next-auth/next"

export async function GET() {
  const session = await getServerSession()

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const indexBlob = await get("applications/index.json")
    const applications = JSON.parse(await indexBlob.text())

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}

