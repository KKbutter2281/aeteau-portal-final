import { NextResponse } from "next/server";
import { put, get } from "@vercel/blob";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    // Parse incoming request
    const { name, email, password, role } = await request.json();

    // Basic validation
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Try to get the user from Vercel Blob Storage
    let existingUser;
    try {
      // You may need to check for a `get` function or change to another correct API call
      existingUser = await get(`users/${email}.json`);
      if (existingUser) {
        return NextResponse.json({ error: "User already exists" }, { status: 409 });
      }
    } catch (error) {
      // Handle if the user doesn't exist (probably 404 or other error codes)
      if (error.status !== 404) {
        console.error("Error checking for existing user:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      }
    }

    // Hash password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      console.error("Error hashing password:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    // Create user object
    const user = {
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
    };

    // Store user in Vercel Blob Storage
    try {
      await put(`users/${email}.json`, JSON.stringify(user), {
        contentType: "application/json",
        access: "public",
      });
    } catch (error) {
      console.error("Error saving user to Vercel Blob Storage:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    // Return success response
    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);

    // Return internal server error if anything goes wrong
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
