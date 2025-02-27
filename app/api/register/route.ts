import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob"; // Assuming `list` is available
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    // Parse incoming request
    const { name, email, password, role } = await request.json();

    // Basic validation
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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
