"use client"

// This is a simplified version of the toast component. You may want to use a more robust solution like react-hot-toast or react-toastify.

import { useState, useEffect } from "react"

export function toast({ title, description, variant = "default" }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md ${
        variant === "destructive" ? "bg-red-500" : "bg-green-500"
      } text-white`}
    >
      <h3 className="font-bold">{title}</h3>
      <p>{description}</p>
    </div>
  )
}

