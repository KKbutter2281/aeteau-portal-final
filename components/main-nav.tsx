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
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/application",
      label: "Application",
      active: pathname === "/application",
    },
    {
      href: "/documents",
      label: "Documents",
      active: pathname === "/documents",
    },
  ]

  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="font-bold">
        College Portal
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

