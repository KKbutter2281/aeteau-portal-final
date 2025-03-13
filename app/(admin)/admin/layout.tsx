import type React from "react"
import { MainNav } from "@/components/admin-nav"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth()
  const user = await currentUser()

  if (!userId || !user) {
    redirect("/sign-in")
  }

  // Check if user is an admin
  const isAdmin = user.publicMetadata.role === "admin"

  if (!isAdmin) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">{children}</div>
      </main>
    </div>
  )
}

