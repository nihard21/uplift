"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

const DotGrid = dynamic(() => import("@/components/DotGrid"), { ssr: false })

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push("/main")
  }

  return (
    <div className="h-screen w-full relative overflow-hidden bg-[#2A1F1A]">
      {/* Interactive Dot Grid Background */}
      <DotGrid
        dotSize={8}
        gap={20}
        baseColor="#2A1F1A"
        activeColor="#6B5647"
        proximity={80}
        speedTrigger={50}
        shockRadius={150}
        shockStrength={8}
        maxSpeed={3000}
        resistance={500}
        returnDuration={1.2}
        className="absolute inset-0 z-0 opacity-80"
        style={{}}
      />

      {/* Deeper gradient for more contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1410]/60 via-transparent to-[#3D4F3A]/15 z-[1]" />

      {/* Green nature accent - subtle vine pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.08] z-[1]">
        <svg viewBox="0 0 200 200" className="w-full h-full text-[#2F3D2C]">
          <path
            d="M100,10 Q120,40 100,70 Q80,100 100,130 Q120,160 100,190"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
          <circle cx="100" cy="30" r="8" fill="currentColor" opacity="0.4" />
          <circle cx="100" cy="90" r="10" fill="currentColor" opacity="0.4" />
          <circle cx="100" cy="150" r="7" fill="currentColor" opacity="0.4" />
        </svg>
      </div>


      {/* Warm ambient glow */}
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#6B5647]/20 via-[#4A3A2E]/10 to-transparent z-[1]" />

      {/* Floating particles */}
      <div className="absolute inset-0 z-[1]">
        {Array.from({ length: 20 }, (_, i) => {
          const xPosition = (i * 5.2) % 100
          const yPosition = 10 + ((i * 4.3) % 80)
          const size = 2 + (i % 3)
          const delay = (i * 0.7) % 10
          const duration = 8 + ((i * 0.5) % 6)

          return (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full bg-[#C8A882]/20 animate-pulse"
              style={{
                left: `${xPosition}%`,
                top: `${yPosition}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
              }}
            />
          )
        })}
      </div>

      {/* Login Content */}
      <div className="relative z-[20] flex items-center justify-center h-full">
        <div className="text-center max-w-md mx-auto px-6">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-[#FFF8E7] mb-4 tracking-wide drop-shadow-lg">UpLift</h1>
            <p className="text-[#C8A882] text-xl mb-2 font-light">Your personal AI journal companion</p>
            <p className="text-[#8B7355] text-lg font-light">for reflection, growth, and emotional wellness</p>
          </div>

          {/* Login Card */}
          <div className="bg-[#3D2F27]/80 backdrop-blur-md border border-[#6B5647]/60 rounded-2xl p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-[#FFF8E7] mb-2">Welcome Back</h2>
              <p className="text-[#C8A882]">Ready to continue your journaling journey?</p>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-[#6B5647] hover:bg-[#2F3D2C] text-[#FFF8E7] py-4 text-lg font-medium rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:opacity-70 border border-[#8B7355]/40"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-[#FFF8E7]/30 border-t-[#FFF8E7] rounded-full animate-spin mr-2" />
                  Signing In...
                </div>
              ) : (
                "Sign In to Your Journal"
              )}
            </Button>

            <div className="mt-6 text-center">
              <p className="text-[#8B7355] text-sm">
                By signing in, you agree to our commitment to your privacy and wellbeing
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-[#8B7355] text-sm">Need support? We&apos;re here 24/7 to help you on your journey</p>
          </div>
        </div>
      </div>
    </div>
  )
}
