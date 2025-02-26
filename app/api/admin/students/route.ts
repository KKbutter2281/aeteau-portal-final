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

    const students = await Promise.all(
      applications.map(async (app) => {
        const userBlob = await get(`users/${app.userId}.json`)
        const user = JSON.parse(await userBlob.text())
        const financialAidBlob = await get(`financial-aid/${app.userId}.json`)
        const financialAid = financialAidBlob ? JSON.parse(await financialAidBlob.text()) : null

        return {
          userId: app.userId,
          name: user.name,
          email: user.email,
          financialAid,
        }
      }),
    )

    return NextResponse.json(students)
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}

