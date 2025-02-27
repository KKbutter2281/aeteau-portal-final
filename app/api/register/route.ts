import { NextResponse } from "next/server"
import { BlobServiceClient } from '@vercel/blob'
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json()

    // Basic validation
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Initialize Blob Service Client
    const blob = new BlobServiceClient();

    // Check if user already exists
    try {
      const existingUser = await blob.get(`users/${email}.json`);
      if (existingUser) {
        return NextResponse.json({ error: "User already exists" }, { status: 409 });
      }
    } catch (error: any) {
      // If the error is that the file doesn't exist, that's fine
      if (error.status !== 404) {
        console.error("Error checking for existing user:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
    await blob.put(`users/${email}.json`, JSON.stringify(user), {
      contentType: "application/json",
      access: 'public',
    })

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}