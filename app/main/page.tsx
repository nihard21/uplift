"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Plus, Menu, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

export default function UpLiftChat() {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chats, activeChat])

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    }
    setChats((prev) => [newChat, ...prev])
    setActiveChat(newChat.id)
    setSidebarOpen(false)
  }

  const handleLogout = () => {
    router.push("/login")
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const currentChatId =
      activeChat ||
      (() => {
        createNewChat()
        return chats[0]?.id || Date.now().toString()
      })()

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              title: chat.messages.length === 0 ? input.trim().slice(0, 30) + "..." : chat.title,
            }
          : chat,
      ),
    )

    setInput("")

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're looking for support and guidance. As UpLift, I'm here to help you navigate through your thoughts and feelings. What specific area would you like to explore today?`,
        sender: "ai",
        timestamp: new Date(),
      }

      setChats((prev) =>
        prev.map((chat) => (chat.id === currentChatId ? { ...chat, messages: [...chat.messages, aiMessage] } : chat)),
      )
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const currentChat = chats.find((chat) => chat.id === activeChat)

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

          {/* Gap-filling flames with original gradients */}
          {Array.from({ length: 100 }, (_, i) => {
            // Ensure complete coverage by using precise positioning
            const basePosition = (i / 99) * 100 // Evenly distribute from 0% to 100%
            const randomOffset = Math.sin(i * 2.3) * Math.cos(i * 1.7) * Math.sin(i * 0.9) * 1.5 // Smaller offset to prevent gaps
            const position = Math.max(0, Math.min(100, basePosition + randomOffset))

            // Higher flames with more natural height variations
            const baseHeight = 45
            const heightVariation = Math.sin(i * 1.3) * Math.cos(i * 2.1) * Math.sin(i * 0.7) * 25
            const randomHeight = Math.sin(i * 3.7) * Math.cos(i * 1.9) * 12
            const height = Math.max(25, baseHeight + heightVariation + randomHeight)

            // Natural width variations - wider to fill gaps
            const baseWidth = 10 // Increased base width to fill gaps
            const widthVariation = Math.cos(i * 1.8) * Math.sin(i * 2.4) * 4
            const width = Math.max(6, baseWidth + widthVariation)

            return (
              <div
                key={`flame-${i}`}
                className={`flame flame-${(i % 7) + 1} absolute bottom-10 bg-gradient-to-t from-red-700 via-orange-500 to-yellow-300 opacity-85`}
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

          {/* Inner core flames with original gradients */}
          {Array.from({ length: 70 }, (_, i) => {
            // Ensure inner flame coverage
            const basePosition = (i / 69) * 100 // Even distribution
            const randomOffset = Math.sin(i * 3.1) * Math.cos(i * 1.4) * Math.sin(i * 2.8) * 2
            const position = Math.max(0, Math.min(100, basePosition + randomOffset))

            // Higher inner flames with natural variations
            const baseHeight = 35
            const heightChaos = Math.sin(i * 2.7) * Math.cos(i * 1.6) * Math.sin(i * 3.2) * 20
            const height = Math.max(18, baseHeight + heightChaos)

            // Wider inner flames to fill gaps
            const baseWidth = 8 // Increased width
            const widthChaos = Math.cos(i * 2.9) * Math.sin(i * 1.8) * 3
            const width = Math.max(4, baseWidth + widthChaos)

            return (
              <div
                key={`inner-flame-${i}`}
                className={`flame flame-inner-${(i % 4) + 1} absolute bottom-10 bg-gradient-to-t from-yellow-400 via-orange-300 to-yellow-100 opacity-90`}
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
            const position = i * 2.86 + 1.43 // More embers
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

      {/* Sidebar */}
      <div
        className={`absolute left-0 top-0 h-full w-80 bg-black/60 backdrop-blur-md border-r border-white/20 transform transition-transform duration-300 z-[30] ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">UpLift</h1>
            <div className="flex items-center space-x-2">
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white hover:bg-red-500/20 hover:text-red-300 transition-colors p-2"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
                <span className="text-xs text-white/60 mt-1">Logout</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-white hover:bg-white/10"
              >
                ×
              </Button>
            </div>
          </div>
          <Button
            onClick={createNewChat}
            className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {chats.map((chat) => (
            <Card
              key={chat.id}
              className={`p-3 cursor-pointer transition-colors bg-white/5 border-white/10 hover:bg-white/10 ${
                activeChat === chat.id ? "bg-white/15" : ""
              }`}
              onClick={() => {
                setActiveChat(chat.id)
                setSidebarOpen(false)
              }}
            >
              <p className="text-white text-sm font-medium truncate">{chat.title}</p>
              <p className="text-white/60 text-xs">{chat.createdAt.toLocaleDateString()}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div
        className={`flex flex-col h-full transition-all duration-300 ${sidebarOpen ? "lg:ml-80" : "lg:ml-80"} relative z-[20]`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mr-2 text-white hover:bg-white/10"
            >
              <Menu className="w-4 h-4" />
            </Button>
            <h2 className="text-lg font-semibold text-white">{currentChat?.title || "UpLift - Your AI Companion"}</h2>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!currentChat && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-2">Welcome to UpLift</h3>
                <p className="text-white/80 mb-6 text-lg">Your compassionate AI companion for mental wellness</p>
                <Button
                  onClick={createNewChat}
                  className="bg-orange-600/80 hover:bg-orange-600 text-white px-6 py-3 text-lg"
                >
                  Start a conversation
                </Button>
              </div>
            </div>
          )}

          {currentChat?.messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <Card
                className={`max-w-[80%] p-4 ${
                  message.sender === "user"
                    ? "bg-orange-600/80 text-white border-orange-500/50"
                    : "bg-white/15 text-white border-white/20 backdrop-blur-sm"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </Card>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-black/30 backdrop-blur-sm relative">
          {/* Fire effect behind input - gap-filled flames */}
          <div className="absolute bottom-0 left-4 right-4 h-32 overflow-hidden pointer-events-none">
            {Array.from({ length: 50 }, (_, i) => {
              // Gap-filling positioning for input flames
              const basePosition = (i / 49) * 100 // Even distribution
              const randomOffset = Math.sin(i * 2.7) * Math.cos(i * 1.9) * 1
              const position = Math.max(0, Math.min(100, basePosition + randomOffset))

              // Natural height variations
              const baseHeight = 16
              const heightChaos = Math.sin(i * 1.8) * Math.cos(i * 2.3) * 8
              const height = Math.max(8, baseHeight + heightChaos)

              // Wider flames to fill gaps
              const baseWidth = 6 // Increased width
              const widthChaos = Math.cos(i * 2.1) * 2
              const width = Math.max(4, baseWidth + widthChaos)

              return (
                <div
                  key={`input-flame-${i}`}
                  className={`input-flame input-flame-${(i % 5) + 1} absolute bottom-0 bg-gradient-to-t from-orange-600/40 via-red-400/25 to-yellow-300/10 opacity-60`}
                  style={{
                    left: `${position}%`,
                    width: `${width}px`,
                    height: `${height}px`,
                    clipPath:
                      "polygon(40% 100%, 20% 80%, 30% 60%, 10% 40%, 25% 20%, 45% 30%, 60% 10%, 70% 25%, 80% 5%, 85% 20%, 75% 40%, 90% 60%, 70% 80%, 60% 100%)",
                  }}
                />
              )
            })}
          </div>

          <div className="flex space-x-2 relative z-10">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              className="flex-1 bg-white/15 border-white/20 text-white placeholder:text-white/60 focus:border-orange-400/50 backdrop-blur-sm"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="bg-orange-600/80 hover:bg-orange-600 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-10 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <style jsx>{`
        @keyframes bigRangeFlicker {
          0% { opacity: 0.85; transform: scaleY(1) scaleX(1) skewX(0deg); }
          10% { opacity: 0.9; transform: scaleY(1.25) scaleX(0.8) skewX(-3deg); }
          20% { opacity: 0.75; transform: scaleY(0.7) scaleX(1.3) skewX(4deg); }
          30% { opacity: 0.88; transform: scaleY(1.15) scaleX(0.85) skewX(-2.5deg); }
          40% { opacity: 0.78; transform: scaleY(0.8) scaleX(1.2) skewX(3.5deg); }
          50% { opacity: 0.92; transform: scaleY(1.3) scaleX(0.75) skewX(-4deg); }
          60% { opacity: 0.82; transform: scaleY(0.75) scaleX(1.25) skewX(3deg); }
          70% { opacity: 0.89; transform: scaleY(1.2) scaleX(0.8) skewX(-3.5deg); }
          80% { opacity: 0.8; transform: scaleY(0.85) scaleX(1.15) skewX(2.5deg); }
          90% { opacity: 0.86; transform: scaleY(1.1) scaleX(0.9) skewX(-2deg); }
          100% { opacity: 0.85; transform: scaleY(1) scaleX(1) skewX(0deg); }
        }

        @keyframes bigRangeGentleFlicker {
          0%, 100% { opacity: 0.65; transform: scaleY(1) scaleX(1) skewX(0deg); }
          25% { opacity: 0.75; transform: scaleY(1.15) scaleX(0.85) skewX(-2deg); }
          50% { opacity: 0.55; transform: scaleY(0.8) scaleX(1.2) skewX(2.5deg); }
          75% { opacity: 0.7; transform: scaleY(1.1) scaleX(0.9) skewX(-1.5deg); }
        }

        .flame {
          animation: bigRangeFlicker 4s ease-in-out infinite;
          filter: blur(0.3px);
        }

        .flame-1 { animation-duration: 3.8s; animation-delay: 0s; }
        .flame-2 { animation-duration: 4.2s; animation-delay: 0.3s; }
        .flame-3 { animation-duration: 4.0s; animation-delay: 0.6s; }
        .flame-4 { animation-duration: 4.4s; animation-delay: 0.9s; }
        .flame-5 { animation-duration: 3.9s; animation-delay: 1.2s; }
        .flame-6 { animation-duration: 4.1s; animation-delay: 1.5s; }
        .flame-7 { animation-duration: 4.3s; animation-delay: 1.8s; }

        .flame-inner-1 { animation-duration: 3.5s; animation-delay: 0.15s; }
        .flame-inner-2 { animation-duration: 3.9s; animation-delay: 0.45s; }
        .flame-inner-3 { animation-duration: 3.7s; animation-delay: 0.75s; }
        .flame-inner-4 { animation-duration: 4.1s; animation-delay: 1.05s; }

        .input-flame {
          animation: bigRangeGentleFlicker 5s ease-in-out infinite;
          filter: blur(0.8px);
        }
      `}</style>
    </div>
  )
}
