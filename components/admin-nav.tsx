"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  const routes = [
    {
      href: "/admin",
      label: "Dashboard",
      active: pathname === "/admin",
    },
    {
      href: "/admin/applications",
      label: "Applications",
      active: pathname === "/admin/applications" || pathname.startsWith("/admin/applications/"),
    },
    {
      href: "/admin/settings",
      label: "Settings",
      active: pathname === "/admin/settings",
    },
  ]

  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="font-bold">
        Admin Portal
      </Link>
      <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              route.active ? "text-primary" : "text-muted-foreground",
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center space-x-4">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  )
}

