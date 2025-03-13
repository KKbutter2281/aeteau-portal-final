import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function POST(request: Request) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const documentType = formData.get("documentType") as string

    if (!file || !documentType) {
      return NextResponse.json({ error: "File and document type are required" }, { status: 400 })
    }

    // Create a unique filename
    const filename = `${userId}-${documentType}-${file.name}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "private",
    })

    // In a real app, you would save the document reference to your database
    // await saveDocumentReference(userId, documentType, blob.url, file.name)

    return NextResponse.json(blob)
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 })
  }
}

