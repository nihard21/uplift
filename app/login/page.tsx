"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setIsLoading(true)
    // Simulate login process
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push("/main")
  }

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Animated Fireplace Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Base fireplace background with ultra-smooth gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-950/95 via-gray-900/90 via-gray-850/85 via-gray-800/80 via-gray-750/75 via-gray-700/70 via-gray-650/65 via-gray-600/60 to-gray-500/55" />

        {/* Enhanced fireplace glow with ultra-smooth gradients */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-orange-600/60 via-orange-550/55 via-orange-500/50 via-orange-450/45 via-red-600/35 via-red-550/32 via-red-500/28 via-red-450/25 via-orange-400/15 via-orange-350/12 via-orange-300/10 via-orange-250/8 via-orange-200/6 via-orange-150/4 via-orange-100/2 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-red-700/70 via-red-650/65 via-red-600/60 via-red-550/55 via-orange-500/40 via-orange-450/36 via-orange-400/32 via-orange-350/28 via-yellow-500/20 via-yellow-450/18 via-yellow-400/15 via-yellow-350/12 via-yellow-300/10 via-yellow-250/8 via-yellow-200/6 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-yellow-600/45 via-yellow-550/42 via-yellow-500/38 via-yellow-450/35 via-orange-400/25 via-orange-350/22 via-orange-300/20 via-orange-250/18 via-red-300/12 via-red-250/10 via-red-200/8 via-red-150/6 via-red-100/4 via-red-50/2 to-transparent" />

        {/* Ultra-smooth transition gradients to top */}
        <div className="absolute bottom-64 left-0 right-0 h-96 bg-gradient-to-t from-orange-500/30 via-orange-450/27 via-orange-400/25 via-orange-350/22 via-red-500/20 via-red-450/18 via-red-400/15 via-red-350/13 via-orange-400/12 via-orange-350/10 via-orange-300/9 via-orange-250/8 via-red-400/6 via-red-350/5 via-red-300/3 via-red-250/2 to-transparent" />
        <div className="absolute bottom-96 left-0 right-0 h-96 bg-gradient-to-t from-orange-400/18 via-orange-350/16 via-orange-300/15 via-orange-250/13 via-red-400/10 via-red-350/9 via-red-300/8 via-red-250/6 via-orange-300/5 via-orange-250/4 via-orange-200/3 via-orange-150/2 via-red-300/2 via-red-250/1 to-transparent" />
        <div className="absolute bottom-[24rem] left-0 right-0 h-96 bg-gradient-to-t from-orange-300/10 via-orange-250/9 via-orange-200/8 via-orange-150/6 via-red-300/5 via-red-250/4 via-red-200/3 via-red-150/2 via-orange-200/2 via-orange-150/1 to-transparent" />
        <div className="absolute bottom-[36rem] left-0 right-0 h-96 bg-gradient-to-t from-orange-200/5 via-orange-150/4 via-orange-100/3 via-red-200/2 via-red-150/2 via-red-100/1 via-orange-100/1 to-transparent" />

        {/* Main fire bed spanning across entire bottom - taller for higher flames */}
        <div className="absolute bottom-0 left-0 right-0 h-72 overflow-hidden">
          {/* Fire logs base with ultra-smooth gradients */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-r from-amber-900/60 via-amber-850/65 via-amber-800/70 via-orange-900/80 via-orange-850/85 via-orange-800/88 via-red-900/90 via-red-850/88 via-red-800/85 via-orange-900/80 via-orange-850/75 via-orange-800/70 via-amber-900/60 via-amber-850/55 to-amber-800/50 opacity-70" />
          <div className="absolute bottom-2 left-0 right-0 h-8 bg-gradient-to-r from-red-900/50 via-red-850/55 via-red-800/60 via-orange-800/70 via-orange-750/75 via-orange-700/78 via-amber-800/80 via-amber-750/78 via-amber-700/75 via-orange-800/70 via-orange-750/65 via-orange-700/60 via-red-900/50 via-red-850/45 to-red-800/40 opacity-60" />
          <div className="absolute bottom-4 left-0 right-0 h-6 bg-gradient-to-r from-amber-800/40 via-amber-750/45 via-amber-700/50 via-red-800/60 via-red-750/65 via-red-700/68 via-orange-700/70 via-orange-650/68 via-orange-600/65 via-red-800/60 via-red-750/55 via-red-700/50 via-amber-800/40 via-amber-750/35 to-amber-700/30 opacity-50" />

          {/* Gap-filled flames with original gradients */}
          {Array.from({ length: 120 }, (_, i) => {
            // Perfect coverage positioning
            const basePosition = (i / 119) * 100 // Evenly distribute from 0% to 100%
            const chaos1 = Math.sin(i * 2.7) * Math.cos(i * 1.3) * 1.2 // Smaller offset to prevent gaps
            const chaos2 = Math.sin(i * 3.9) * Math.cos(i * 2.1) * 0.8
            const position = Math.max(0, Math.min(100, basePosition + chaos1 + chaos2))

            // Much higher flames with natural height variations
            const baseHeight = 55
            const heightChaos1 = Math.sin(i * 1.7) * Math.cos(i * 2.9) * 30
            const heightChaos2 = Math.sin(i * 3.1) * Math.cos(i * 1.4) * 18
            const height = Math.max(30, baseHeight + heightChaos1 + heightChaos2)

            // Wider flames to ensure no gaps
            const baseWidth = 12 // Increased width for gap coverage
            const widthChaos1 = Math.cos(i * 2.4) * Math.sin(i * 1.6) * 5
            const width = Math.max(6, baseWidth + widthChaos1)

            return (
              <div
                key={`flame-${i}`}
                className={`flame flame-${(i % 7) + 1} absolute bottom-10 bg-gradient-to-t from-red-700 via-orange-500 to-yellow-300 opacity-80`}
                style={{
                  left: `${position}%`,
                  width: `${width}px`,
                  height: `${height}px`,
                  clipPath:
                    "polygon(45% 100%, 25% 85%, 35% 65%, 15% 45%, 30% 25%, 50% 35%, 65% 15%, 75% 30%, 85% 10%, 90% 25%, 80% 45%, 95% 65%, 75% 85%, 55% 100%)",
                }}
              />
            )
          })}

          {/* Gap-filled inner core flames with original gradients */}
          {Array.from({ length: 80 }, (_, i) => {
            // Perfect inner flame coverage
            const basePosition = (i / 79) * 100 // Even distribution
            const innerChaos1 = Math.sin(i * 4.1) * Math.cos(i * 1.7) * 1.5
            const innerChaos2 = Math.sin(i * 2.6) * Math.cos(i * 3.3) * 1
            const position = Math.max(0, Math.min(100, basePosition + innerChaos1 + innerChaos2))

            // Much higher inner flames with natural variations
            const baseHeight = 45
            const innerHeightChaos1 = Math.sin(i * 3.4) * Math.cos(i * 1.9) * 25
            const innerHeightChaos2 = Math.sin(i * 2.1) * Math.cos(i * 4.2) * 15
            const height = Math.max(22, baseHeight + innerHeightChaos1 + innerHeightChaos2)

            // Wider inner flames for gap coverage
            const baseWidth = 9 // Increased width
            const innerWidthChaos = Math.cos(i * 3.7) * Math.sin(i * 2.2) * 4
            const width = Math.max(5, baseWidth + innerWidthChaos)

            return (
              <div
                key={`inner-flame-${i}`}
                className={`flame flame-inner-${(i % 4) + 1} absolute bottom-10 bg-gradient-to-t from-yellow-400 via-orange-300 to-yellow-100 opacity-85`}
                style={{
                  left: `${position}%`,
                  width: `${width}px`,
                  height: `${height}px`,
                  clipPath:
                    "polygon(50% 100%, 30% 88%, 40% 68%, 20% 48%, 35% 28%, 55% 38%, 70% 18%, 80% 33%, 90% 13%, 95% 28%, 85% 48%, 100% 68%, 80% 88%, 60% 100%)",
                }}
              />
            )
          })}

          {/* Hot coals glow with ultra-smooth gradients */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-red-600/60 via-red-550/62 via-red-500/65 via-orange-500/80 via-orange-450/78 via-orange-400/75 via-yellow-500/70 via-yellow-450/72 via-yellow-400/75 via-orange-500/80 via-orange-450/78 via-orange-400/75 via-red-600/60 via-red-550/58 to-red-500/55 opacity-70 animate-pulse" />
          <div
            className="absolute bottom-1 left-0 right-0 h-6 bg-gradient-to-r from-orange-400/50 via-orange-350/55 via-orange-300/60 via-yellow-400/70 via-yellow-350/68 via-yellow-300/65 via-red-400/60 via-red-350/62 via-red-300/65 via-yellow-400/70 via-yellow-350/68 via-yellow-300/65 via-orange-400/50 via-orange-350/48 to-orange-300/45 opacity-80 animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-2 left-0 right-0 h-4 bg-gradient-to-r from-yellow-300/40 via-yellow-250/45 via-yellow-200/50 via-orange-300/60 via-orange-250/58 via-orange-200/55 via-yellow-300/50 via-yellow-250/52 via-yellow-200/55 via-orange-300/60 via-orange-250/58 via-orange-200/55 via-yellow-300/40 via-yellow-250/38 to-yellow-200/35 opacity-60 animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Enhanced glowing embers scattered evenly across full width */}
        <div className="absolute bottom-4 left-0 right-0 h-40">
          {Array.from({ length: 35 }, (_, i) => {
            const position = i * 2.86 + 1.43
            const size = 1 + Math.random() * 2
            const delay = Math.random() * 6

            return (
              <div
                key={`ember-${i}`}
                className="ember absolute bg-orange-400 rounded-full animate-ping"
                style={{
                  left: `${position}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${delay}s`,
                }}
              />
            )
          })}
        </div>
      </div>

      {/* Enhanced Blur Overlay */}
      <div className="absolute inset-0 bg-black/35 backdrop-blur-[0.5px] z-[1]" />

      {/* Login Content */}
      <div className="relative z-[20] flex items-center justify-center h-full">
        <div className="text-center max-w-md mx-auto px-6">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-white mb-4 tracking-wide">UpLift</h1>
            <p className="text-white/80 text-xl mb-2">Your personal AI journal companion</p>
            <p className="text-white/60 text-lg">for reflection, growth, and emotional wellness</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Welcome Back</h2>
              <p className="text-white/70">Ready to continue your journaling journey?</p>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-orange-600/80 hover:bg-orange-600 text-white py-4 text-lg font-medium rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Signing In...
                </div>
              ) : (
                "Sign In to Your Journal"
              )}
            </Button>

            <div className="mt-6 text-center">
              <p className="text-white/50 text-sm">
                By signing in, you agree to our commitment to your privacy and wellbeing
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm">Need support? We're here 24/7 to help you on your journey</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bigRangeSlowFlicker {
          0% { opacity: 0.8; transform: scaleY(1) scaleX(1) skewX(0deg); }
          12% { opacity: 0.9; transform: scaleY(1.35) scaleX(0.7) skewX(-4deg); }
          25% { opacity: 0.65; transform: scaleY(0.65) scaleX(1.4) skewX(5deg); }
          37% { opacity: 0.85; transform: scaleY(1.2) scaleX(0.8) skewX(-3deg); }
          50% { opacity: 0.7; transform: scaleY(0.75) scaleX(1.3) skewX(4.5deg); }
          62% { opacity: 0.88; transform: scaleY(1.4) scaleX(0.65) skewX(-4.5deg); }
          75% { opacity: 0.75; transform: scaleY(0.8) scaleX(1.25) skewX(3.5deg); }
          87% { opacity: 0.82; transform: scaleY(1.15) scaleX(0.85) skewX(-2.5deg); }
          100% { opacity: 0.8; transform: scaleY(1) scaleX(1) skewX(0deg); }
        }
        
        .flame {
          animation: bigRangeSlowFlicker 5s ease-in-out infinite;
          filter: blur(0.3px);
        }
        
        .flame-1 { animation-duration: 4.8s; animation-delay: 0s; }
        .flame-2 { animation-duration: 5.2s; animation-delay: 0.4s; }
        .flame-3 { animation-duration: 5.0s; animation-delay: 0.8s; }
        .flame-4 { animation-duration: 5.4s; animation-delay: 1.2s; }
        .flame-5 { animation-duration: 4.9s; animation-delay: 1.6s; }
        .flame-6 { animation-duration: 5.1s; animation-delay: 2.0s; }
        .flame-7 { animation-duration: 5.3s; animation-delay: 2.4s; }
        
        .flame-inner-1 { animation-duration: 4.5s; animation-delay: 0.2s; }
        .flame-inner-2 { animation-duration: 4.9s; animation-delay: 0.6s; }
        .flame-inner-3 { animation-duration: 4.7s; animation-delay: 1.0s; }
        .flame-inner-4 { animation-duration: 5.1s; animation-delay: 1.4s; }
      `}</style>
    </div>
  )
}
