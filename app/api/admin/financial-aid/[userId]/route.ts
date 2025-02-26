import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getServerSession } from "next-auth/next"

export async function POST(request: Request, { params }: { params: { userId: string } }) {
  const session = await getServerSession()

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { userId } = params
  const { scholarshipAmount, grantAmount } = await request.json()

  try {
    const financialAid = {
      scholarshipAmount,
      grantAmount,
      updatedAt: new Date().toISOString(),
    }

    await put(`financial-aid/${userId}.json`, JSON.stringify(financialAid), {
      contentType: "application/json",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating financial aid:", error)
    return NextResponse.json({ error: "Failed to update financial aid" }, { status: 500 })
  }
}

