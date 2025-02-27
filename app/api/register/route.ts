import { NextResponse } from "next/server"
import { put, get } from '@vercel/blob'
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    // Parse incoming request
    const { name, email, password, role } = await request.json()

    // Basic validation
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists in Vercel Blob Storage
    try {
      const existingUser = await get(`users/${email}.json`)

      // If user already exists, return conflict status
      if (existingUser) {
        return NextResponse.json({ error: "User already exists" }, { status: 409 })
      }
    } catch (error) {
      // If the error is a 404 (not found), that's okay, it means user doesn't exist yet
      if (error.status !== 404) {
        console.error("Error checking for existing user:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
      }
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
    await put(`users/${email}.json`, JSON.stringify(user), {
      contentType: "application/json",
      access: 'public',
    })

    // Return success response
    return NextResponse.json({ message: "User registered successfully" }, { status: 201 })

  } catch (error) {
    console.error("Registration error:", error)

    // Return internal server error if anything goes wrong
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
