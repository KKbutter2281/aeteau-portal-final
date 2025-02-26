import { NextResponse } from "next/server"
import { put, get } from "@vercel/blob"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json()

    // Basic validation
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists using GET
    const userBlob = await get(`users/${email}.json`)
    if (userBlob) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user object
    const user = {
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
    }

    // Store user in Vercel Blob Storage
    await put(`users/${email}.json`, JSON.stringify(user), { contentType: "application/json" })

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}