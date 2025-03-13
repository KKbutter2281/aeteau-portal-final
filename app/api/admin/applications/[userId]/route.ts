// filepath: /c:/Users/Owner/OneDrive/Desktop/A2C/portal-final/app/api/admin/applications/[userId]/route.ts
import { auth } from '@clerk/nextjs'
import { NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params
  const { user } = auth()

  // Check if the user is authenticated and has the admin role
  if (!user || user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('userId', userId)
      .single()

    if (error) {
      return new Response(JSON.stringify({ error: "Application not found" }), { status: 404 })
    }

    return new Response(JSON.stringify(data))
  } catch (error) {
    console.error("Error fetching application:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch application" }), { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params
  const { decision, comments } = await request.json()
  const { user } = auth()

  // Check if the user is authenticated and has the admin role
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Update application status
    const { data: application, error: applicationError } = await supabase
      .from('applications')
      .select('*')
      .eq('userId', userId)
      .single()

    if (applicationError) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const { error: updateError } = await supabase
      .from('applications')
      .update({ status: decision, adminComments: comments })
      .eq('userId', userId)

    if (updateError) {
      throw updateError
    }

    // Update application index
    const { data: index, error: indexError } = await supabase
      .from('application_index')
      .select('*')

    if (indexError) {
      return NextResponse.json({ error: "Application index not found" }, { status: 404 })
    }

    const updatedIndex = index.map((app) => {
      if (app.userId === userId) {
        app.status = decision
      }
      return app
    })

    const { error: indexUpdateError } = await supabase
      .from('application_index')
      .upsert(updatedIndex)

    if (indexUpdateError) {
      throw indexUpdateError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}