"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

// interface JournalEntry {
//   id: string
//   content: string
//   timestamp: Date
//   aiAnalysis?: {
//     emotions: string[]
//     feelings: string
//     observations: string
//     improvementTips: string[]
//   }
// }

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page on app start
    router.push("/login")
  }, [router])

  return (
    <div className="h-screen w-full flex items-center justify-center bg-black">
      <div className="text-white">Loading...</div>
    </div>
  )
}
