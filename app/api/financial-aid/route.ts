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
    const financialAidBlob = await get(`financial-aid/${userId}.json`)

    if (financialAidBlob) {
      const financialAid = JSON.parse(await financialAidBlob.text())
      return NextResponse.json(financialAid)
    } else {
      return NextResponse.json(null)
    }
  } catch (error) {
    console.error("Error fetching financial aid information:", error)
    return NextResponse.json({ error: "Failed to fetch financial aid information" }, { status: 500 })
  }
}

