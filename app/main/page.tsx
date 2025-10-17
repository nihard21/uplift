"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Send,
  Menu,
  LogOut,
  BookOpen,
  Brain,
  Lightbulb,
  Heart,
  TrendingUp,
  Calendar,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Leaf,
} from "lucide-react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

const DotGrid = dynamic(() => import("@/components/DotGrid"), { ssr: false })

interface JournalEntry {
  id: string
  content: string
  timestamp: Date
  aiAnalysis?: {
    emotions: string[]
    feelings: string
    observations: string
    improvementTips: string[]
    sentimentScore: number
  }
}

interface TrendAnalysis {
  overallMood: string
  emotionalPatterns: string[]
  weeklyInsights: string
  monthlyTrends: string
  recommendations: string[]
}

export default function UpLiftJournal() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null)
  const [input, setInput] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showTrends, setShowTrends] = useState(false)
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)
  const [aiAnalysisExpanded, setAiAnalysisExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const today = new Date()
    const todayKey = today.toDateString()

    const existingEntry = journalEntries.find((entry) => entry.timestamp.toDateString() === todayKey)

    if (!existingEntry) {
      const newEntry: JournalEntry = {
        id: `${todayKey}-${Date.now()}`,
        content: "",
        timestamp: today,
      }
      setJournalEntries((prev) => [newEntry, ...prev])
      setCurrentEntry(newEntry)
    } else {
      setCurrentEntry(existingEntry)
    }
  }, [journalEntries])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [journalEntries, currentEntry])

  const handleLogout = () => {
    router.push("/login")
  }

  const getCurrentEntryIndex = () => {
    if (!currentEntry) return -1
    return journalEntries.findIndex((entry) => entry.id === currentEntry.id)
  }

  const goToPreviousEntry = () => {
    const currentIndex = getCurrentEntryIndex()
    if (currentIndex < journalEntries.length - 1) {
      setCurrentEntry(journalEntries[currentIndex + 1])
    }
  }

  const goToNextEntry = () => {
    const currentIndex = getCurrentEntryIndex()
    if (currentIndex > 0) {
      setCurrentEntry(journalEntries[currentIndex - 1])
    }
  }

  const canGoToPrevious = () => {
    const currentIndex = getCurrentEntryIndex()
    return currentIndex < journalEntries.length - 1
  }

  const canGoToNext = () => {
    const currentIndex = getCurrentEntryIndex()
    return currentIndex > 0
  }

  const saveEntry = async () => {
    if (!input.trim() || !currentEntry) return

    const updatedEntry: JournalEntry = {
      ...currentEntry,
      content: currentEntry.content + (currentEntry.content ? "\n\n" : "") + input.trim(),
      timestamp: new Date(),
    }

    setJournalEntries((prev) => prev.map((entry) => (entry.id === currentEntry.id ? updatedEntry : entry)))

    setCurrentEntry(updatedEntry)
    setInput("")
    setIsAnalyzing(true)

    try {
      const analysis = await analyzeWithMistral(input.trim())

      const finalEntry: JournalEntry = {
        ...updatedEntry,
        aiAnalysis: analysis,
      }

      setJournalEntries((prev) => prev.map((entry) => (entry.id === currentEntry.id ? finalEntry : entry)))
      setCurrentEntry(finalEntry)
    } catch (error) {
      console.error("AI analysis failed:", error)
      const fallbackAnalysis = getBasicAnalysis(input.trim())
      const finalEntry: JournalEntry = {
        ...updatedEntry,
        aiAnalysis: fallbackAnalysis,
      }
      setJournalEntries((prev) => prev.map((entry) => (entry.id === currentEntry.id ? finalEntry : entry)))
      setCurrentEntry(finalEntry)
    }

    setIsAnalyzing(false)
  }

  const analyzeWithMistral = async (content: string) => {
    const prompt = `Analyze this journal entry and provide insights in JSON format:

"${content}"

Please analyze the emotions, feelings, observations, and provide improvement tips. Return only valid JSON like this:

{
  "emotions": ["emotion1", "emotion2", "emotion3"],
  "feelings": "description of their emotional state",
  "observations": "observations about their writing and thoughts",
  "improvementTips": ["tip1", "tip2", "tip3", "tip4"],
  "sentimentScore": 0.75
}`

    try {
      const { aiAnalysis } = await import("@/lib/huggingface")

      const result = await aiAnalysis(prompt, "distilgpt2")

      try {
        const analysisText = result.generated_text || ""

        let jsonMatch = analysisText.match(/\{[\s\S]*\}/)

        if (!jsonMatch) {
          jsonMatch = result.generated_text?.match(/\{[\s\S]*\}/)
        }

        if (jsonMatch) {
          const parsedAnalysis = JSON.parse(jsonMatch[0])

          if (
            parsedAnalysis.emotions &&
            parsedAnalysis.feelings &&
            parsedAnalysis.observations &&
            parsedAnalysis.improvementTips &&
            typeof parsedAnalysis.sentimentScore === "number"
          ) {
            return parsedAnalysis
          } else {
            throw new Error("Invalid response structure")
          }
        }

        throw new Error("No JSON found in response")
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError)
        console.log("Raw response:", result)
        throw new Error("Failed to parse AI response")
      }
    } catch (error) {
      console.error("Mistral API error:", error)
      throw error
    }
  }

  const getBasicAnalysis = (content: string) => {
    const text = content.toLowerCase()
    let emotions: string[] = []
    let feelings = ""
    let observations = ""
    let improvementTips: string[] = []
    let sentimentScore = 0.5

    const contentAnalysis = {
      work: {
        keywords: [
          "work",
          "job",
          "office",
          "meeting",
          "deadline",
          "boss",
          "colleague",
          "project",
          "career",
          "promotion",
          "stress",
          "pressure",
          "exhausted",
          "tired",
          "overwhelmed",
        ],
        emotions: ["Stressed", "Overwhelmed", "Frustrated", "Anxious", "Determined", "Accomplished", "Confident"],
        feelings: [
          "You're experiencing work-related stress and pressure that's affecting your emotional state.",
          "Work challenges are taking a toll on your energy and mental wellbeing.",
          "You're feeling overwhelmed by professional responsibilities and expectations.",
        ],
        observations: [
          "Your writing shows you're carrying significant work stress that needs attention.",
          "You demonstrate strong work ethic but may be neglecting self-care.",
          "There's a pattern of work-related emotional exhaustion in your entry.",
        ],
        tips: [
          "Set clear boundaries between work and personal time",
          "Practice stress management techniques like deep breathing",
          "Consider discussing workload with your supervisor",
          "Schedule regular breaks throughout your workday",
        ],
      },

      relationships: {
        keywords: [
          "friend",
          "family",
          "partner",
          "relationship",
          "love",
          "breakup",
          "marriage",
          "dating",
          "conflict",
          "argument",
          "support",
          "lonely",
          "miss",
          "care",
          "hurt",
        ],
        emotions: ["Loving", "Lonely", "Hurt", "Grateful", "Confused", "Hopeful", "Anxious"],
        feelings: [
          "You're navigating complex emotions around relationships and connections.",
          "Relationship dynamics are significantly impacting your emotional wellbeing.",
          "You're experiencing deep feelings about your connections with others.",
        ],
        observations: [
          "Your writing reveals deep emotional investment in your relationships.",
          "You show strong empathy and care for the people in your life.",
          "There's emotional vulnerability in how you express relationship concerns.",
        ],
        tips: [
          "Practice open communication with those you care about",
          "Set healthy boundaries in your relationships",
          "Seek support from trusted friends or professionals",
          "Practice self-compassion while navigating relationship challenges",
        ],
      },

      health: {
        keywords: [
          "health",
          "sick",
          "pain",
          "exercise",
          "diet",
          "sleep",
          "energy",
          "fatigue",
          "stress",
          "anxiety",
          "depression",
          "mood",
          "wellness",
          "self-care",
        ],
        emotions: ["Concerned", "Hopeful", "Frustrated", "Determined", "Anxious", "Optimistic"],
        feelings: [
          "You're focused on your physical and mental health journey.",
          "Health concerns are playing a significant role in your current state.",
          "You're actively working on improving your overall wellbeing.",
        ],
        observations: [
          "Your writing shows self-awareness about your health needs.",
          "You demonstrate commitment to personal wellness and growth.",
          "There's a thoughtful approach to health-related challenges.",
        ],
        tips: [
          "Consult with healthcare professionals for specific concerns",
          "Establish consistent sleep and exercise routines",
          "Practice stress-reduction techniques regularly",
          "Build a support network for your health journey",
        ],
      },

      growth: {
        keywords: [
          "goal",
          "dream",
          "future",
          "plan",
          "achieve",
          "success",
          "failure",
          "learn",
          "grow",
          "change",
          "improve",
          "motivated",
          "inspired",
          "hopeful",
          "ambitious",
        ],
        emotions: ["Hopeful", "Motivated", "Inspired", "Anxious", "Determined", "Optimistic"],
        feelings: [
          "You're in a period of personal growth and self-discovery.",
          "Future goals and aspirations are driving your current motivation.",
          "You're actively working on becoming the person you want to be.",
        ],
        observations: [
          "Your writing shows strong self-reflection and growth mindset.",
          "You demonstrate clear vision for your personal development.",
          "There's healthy ambition and determination in your approach.",
        ],
        tips: [
          "Break down large goals into smaller, achievable steps",
          "Celebrate small wins along your journey",
          "Stay flexible and adjust goals as needed",
          "Find mentors or role models who inspire you",
        ],
      },
    }

    let bestMatch = null
    let highestScore = 0

    for (const [category, data] of Object.entries(contentAnalysis)) {
      const score = data.keywords.filter((keyword) => text.includes(keyword)).length
      if (score > highestScore) {
        highestScore = score
        bestMatch = { category, data }
      }
    }

    if (bestMatch && highestScore >= 2) {
      const { data } = bestMatch

      emotions = data.emotions.sort(() => Math.random() - 0.5).slice(0, 3)
      feelings = data.feelings[Math.floor(Math.random() * data.feelings.length)]
      observations = data.observations[Math.floor(Math.random() * data.observations.length)]
      improvementTips = data.tips.sort(() => Math.random() - 0.5).slice(0, 4)

      if (text.includes("happy") || text.includes("joy") || text.includes("excited") || text.includes("grateful")) {
        sentimentScore = 0.7 + Math.random() * 0.3
      } else if (
        text.includes("sad") ||
        text.includes("angry") ||
        text.includes("frustrated") ||
        text.includes("overwhelmed")
      ) {
        sentimentScore = 0.2 + Math.random() * 0.3
      } else {
        sentimentScore = 0.4 + Math.random() * 0.4
      }
    } else {
      const emotionKeywords = {
        positive: [
          "happy",
          "joy",
          "excited",
          "great",
          "wonderful",
          "amazing",
          "blessed",
          "grateful",
          "thankful",
          "content",
          "peaceful",
          "energized",
          "inspired",
          "motivated",
          "confident",
          "proud",
          "accomplished",
          "fulfilled",
          "optimistic",
          "hopeful",
        ],
        negative: [
          "sad",
          "depressed",
          "down",
          "lonely",
          "angry",
          "frustrated",
          "mad",
          "irritated",
          "anxious",
          "worried",
          "stress",
          "nervous",
          "scared",
          "fearful",
          "overwhelmed",
          "exhausted",
          "tired",
          "hopeless",
          "helpless",
          "confused",
          "lost",
          "uncertain",
        ],
        reflective: [
          "thoughtful",
          "contemplative",
          "mindful",
          "aware",
          "conscious",
          "introspective",
          "analytical",
          "curious",
          "questioning",
          "searching",
          "exploring",
          "learning",
          "growing",
          "evolving",
          "changing",
          "transitioning",
          "adapting",
          "processing",
          "understanding",
          "realizing",
        ],
      }

      const positiveCount = emotionKeywords.positive.filter((word) => text.includes(word)).length
      const negativeCount = emotionKeywords.negative.filter((word) => text.includes(word)).length

      if (positiveCount > negativeCount && positiveCount > 0) {
        emotions = ["Happy", "Positive", "Grateful"]
        feelings = "Your writing shows a positive and optimistic outlook."
        observations = "You're experiencing positive emotions and seem to be in a good place mentally."
        improvementTips = [
          "Document what made you feel this way - it can help on harder days",
          "Share your positive energy with others who might need it",
          "Use this positive state to set intentions for continued growth",
          "Express gratitude to those who contributed to your positive feelings",
        ]
        sentimentScore = 0.8 + Math.random() * 0.2
      } else if (negativeCount > positiveCount && negativeCount > 0) {
        emotions = ["Sad", "Stressed", "Overwhelmed"]
        feelings = "You're going through a challenging emotional period."
        observations = "Your writing shows vulnerability and honesty about your struggles."
        improvementTips = [
          "Consider reaching out to a trusted friend or family member",
          "Practice self-compassion - it's okay to not be okay",
          "Try small acts of self-care like taking a walk",
          "Consider speaking with a mental health professional if these feelings persist",
        ]
        sentimentScore = 0.1 + Math.random() * 0.3
      } else {
        emotions = ["Reflective", "Thoughtful", "Contemplative"]
        feelings = "You're in a reflective state, processing your thoughts and experiences."
        observations = "Your writing shows self-awareness and a balanced perspective."
        improvementTips = [
          "Continue this reflective practice - it's valuable for personal growth",
          "Consider what patterns you notice in your thoughts",
          "Use this clarity to set small, achievable goals",
          "Share your insights with others who might benefit",
        ]
        sentimentScore = 0.4 + Math.random() * 0.4
      }
    }

    return {
      emotions,
      feelings,
      observations,
      improvementTips,
      sentimentScore,
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      saveEntry()
    }
  }

  const getTrendAnalysis = (): TrendAnalysis => {
    if (journalEntries.length < 2) {
      return {
        overallMood: "Not enough data yet",
        emotionalPatterns: ["Keep journaling to see patterns emerge"],
        weeklyInsights: "Continue writing daily to build insights",
        monthlyTrends: "Monthly trends will appear after more entries",
        recommendations: ["Write consistently", "Be honest with your feelings", "Review past entries regularly"],
      }
    }

    const entriesWithAnalysis = journalEntries.filter((entry) => entry.aiAnalysis)
    const recentEntries = entriesWithAnalysis.slice(0, 7)

    const avgSentiment =
      recentEntries.reduce((sum, entry) => sum + (entry.aiAnalysis?.sentimentScore || 0.5), 0) / recentEntries.length

    let overallMood = "Neutral"
    if (avgSentiment > 0.7) overallMood = "Generally Positive"
    else if (avgSentiment < 0.3) overallMood = "Generally Challenging"
    else overallMood = "Mixed"

    const emotionCounts: { [key: string]: number } = {}
    recentEntries.forEach((entry) => {
      entry.aiAnalysis?.emotions.forEach((emotion) => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
      })
    })

    const topEmotions = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([emotion]) => emotion)

    const weeklyInsights = `Over the past week, you've been feeling ${overallMood.toLowerCase()}. Your most common emotions were ${topEmotions.join(", ")}.`

    const monthlyTrends =
      journalEntries.length > 7
        ? `You've been journaling consistently for ${Math.floor(journalEntries.length / 7)} weeks. This shows great commitment to self-reflection.`
        : "Keep up the daily journaling to see monthly patterns emerge."

    const recommendations = [
      "Continue your daily journaling practice",
      "Review past entries weekly to spot patterns",
      "Celebrate your consistency and self-awareness",
      "Consider sharing insights with trusted friends or professionals",
    ]

    return {
      overallMood,
      emotionalPatterns: topEmotions,
      weeklyInsights,
      monthlyTrends,
      recommendations,
    }
  }

  const trends = getTrendAnalysis()

  return (
    <div className="h-screen w-full relative overflow-hidden bg-[#2A1F1A]">
      {/* Interactive Dot Grid Background */}
      <DotGrid
        dotSize={3}
        gap={40}
        baseColor="#2A1F1A"
        activeColor="#2F3D2C"
        proximity={120}
        speedTrigger={80}
        shockRadius={200}
        shockStrength={4}
        className="absolute inset-0 z-0 opacity-40"
      />

      {/* Deeper gradient for more contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1410]/50 via-transparent to-[#3D4F3A]/10 z-[1]" />

      {/* Green nature accent - corner decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.06] z-[1]">
        <svg viewBox="0 0 200 200" className="w-full h-full text-[#2F3D2C]">
          <path
            d="M100,10 Q120,40 100,70 Q80,100 100,130 Q120,160 100,190"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
          />
          <circle cx="100" cy="30" r="10" fill="currentColor" />
          <circle cx="100" cy="90" r="12" fill="currentColor" />
          <circle cx="100" cy="150" r="9" fill="currentColor" />
        </svg>
      </div>

      {/* Sidebar with enhanced contrast */}
      <div
        className={`absolute left-0 top-0 h-full w-80 bg-[#1A1410]/98 backdrop-blur-md border-r border-[#2F3D2C]/70 transform transition-transform duration-300 z-[30] ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 shadow-2xl`}
      >
        <div className="p-4 border-b border-[#2F3D2C]/50">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-[#FFF8E7] flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-[#C8A882]" />
              UpLift Journal
            </h1>
            <div className="flex items-center space-x-2">
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-[#C8A882] hover:bg-[#3D2F27]/70 hover:text-[#B89968] transition-colors p-2"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
                <span className="text-xs text-[#8B7355] mt-1">Logout</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-[#FFF8E7] hover:bg-[#3D2F27]/70"
              >
                ×
              </Button>
            </div>
          </div>

          {/* Daily Entry Info with green accent */}
          <div
            className="bg-[#3D2F27] hover:bg-[#4A3A2E] rounded-lg p-3 mb-4 cursor-pointer transition-colors border border-[#6B5647]/60"
            onClick={() => {
              setShowTrends(false)
              setShowAIAnalysis(false)
              setSidebarOpen(false)
            }}
          >
            <div className="flex items-center mb-2">
              <Calendar className="w-4 h-4 text-[#C8A882] mr-2" />
              <span className="text-[#FFF8E7] text-sm font-medium">Today&apos;s Entry</span>
            </div>
            <p className="text-[#C8A882] text-xs">
              {currentEntry?.timestamp.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-2">
            <Button
              onClick={() => {
                setShowTrends(true)
                setShowAIAnalysis(false)
                setSidebarOpen(false)
              }}
              className={`w-full justify-start ${showTrends ? "bg-[#4A3A2E] text-[#FFF8E7] border-l-2 border-[#2F3D2C]" : "bg-[#3D2F27]/40 text-[#C8A882] hover:bg-[#3D2F27]/70"}`}
              variant="ghost"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Trends & Insights
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="flex items-center mb-3">
            <h3 className="text-[#FFF8E7] text-sm font-medium">Recent Entries</h3>
            <Leaf className="w-3 h-3 ml-2 text-[#2F3D2C]/60" />
          </div>
          {journalEntries.slice(0, 10).map((entry, index) => (
            <Card
              key={`${entry.id}-${index}`}
              className={`p-3 cursor-pointer transition-colors bg-[#3D2F27]/50 border-[#6B5647]/60 hover:bg-[#4A3A2E]/70 ${
                currentEntry?.id === entry.id ? "bg-[#4A3A2E]/80 border-[#6B5647] shadow-lg" : ""
              }`}
              onClick={() => {
                setCurrentEntry(entry)
                setShowTrends(false)
                setSidebarOpen(false)
              }}
            >
              <p className="text-[#FFF8E7] text-sm font-medium truncate">
                {entry.timestamp.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-[#C8A882] text-xs">
                {entry.content.slice(0, 25) + (entry.content.length > 25 ? "..." : "")}
              </p>
              {entry.aiAnalysis && (
                <div className="flex items-center mt-2">
                  <Brain className="w-3 h-3 text-[#2F3D2C] mr-1" />
                  <span className="text-xs text-[#2F3D2C]">AI Analyzed</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Main Journal Area */}
      <div
        className={`flex flex-col h-full transition-all duration-300 ${sidebarOpen ? "lg:ml-80" : "lg:ml-80"} relative z-[20]`}
      >
        {/* Header with better contrast */}
        <div className="p-4 border-b border-[#2F3D2C]/50 bg-[#1A1410]/95 backdrop-blur-sm shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-2 text-[#FFF8E7] hover:bg-[#3D2F27]/70"
              >
                <Menu className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-semibold text-[#FFF8E7] flex items-center">
                {showTrends ? (
                  <>
                    <TrendingUp className="w-5 h-5 mr-2 text-[#C8A882]" />
                    Trends & Insights
                  </>
                ) : (
                  <>
                    <BookOpen className="w-5 h-5 mr-2 text-[#C8A882]" />
                    Today&apos;s Journal Entry
                  </>
                )}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {currentEntry && (
                <span className="text-[#8B7355] text-sm">
                  {currentEntry.timestamp.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
              {!showTrends && currentEntry?.aiAnalysis && (
                <Button
                  onClick={() => setAiAnalysisExpanded(!aiAnalysisExpanded)}
                  className="bg-[#4A3A2E] hover:bg-[#2F3D2C] text-[#FFF8E7] border border-[#6B5647]/60 shadow-md"
                  size="sm"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  AI Analysis
                  {aiAnalysisExpanded ? (
                    <ChevronUp className="w-4 h-4 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-2" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content with Navigation Buttons */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
          {!showTrends && canGoToPrevious() && (
            <Button
              onClick={goToPreviousEntry}
              className="fixed left-[calc(320px+1rem)] top-1/2 -translate-y-1/2 z-[25] bg-[#3D2F27]/80 hover:bg-[#4A3A2E]/90 text-[#FFF8E7] border border-[#6B5647]/60 backdrop-blur-sm shadow-lg"
              size="icon"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          )}

          {!showTrends && canGoToNext() && (
            <Button
              onClick={goToNextEntry}
              className="fixed right-4 top-1/2 -translate-y-1/2 z-[25] bg-[#3D2F27]/80 hover:bg-[#4A3A2E]/90 text-[#FFF8E7] border border-[#6B5647]/60 backdrop-blur-sm shadow-lg"
              size="icon"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          )}

          {showTrends ? (
            <div className="space-y-6">
              <Card className="bg-[#3D2F27]/90 border-[#6B5647]/70 backdrop-blur-sm p-6 shadow-xl">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-6 h-6 text-[#C8A882] mr-2" />
                  <h3 className="text-xl font-semibold text-[#FFF8E7]">Overall Mood</h3>
                  <Leaf className="w-5 h-5 ml-auto text-[#2F3D2C]/60" />
                </div>
                <p className="text-[#FFF8E7] text-lg mb-2 font-medium">{trends.overallMood}</p>
                <div className="flex flex-wrap gap-2">
                  {trends.emotionalPatterns.map((emotion, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#4A3A2E] text-[#FFF8E7] font-medium rounded-full text-sm border border-[#6B5647]"
                    >
                      {emotion}
                    </span>
                  ))}
                </div>
              </Card>

              <Card className="bg-[#4A3A2E]/90 border-[#6B5647]/70 backdrop-blur-sm p-6 shadow-xl">
                <h3 className="text-xl font-semibold text-[#FFF8E7] mb-4">Weekly Insights</h3>
                <p className="text-[#FFF8E7] leading-relaxed font-medium">{trends.weeklyInsights}</p>
              </Card>

              <Card className="bg-[#6B5647]/80 border-[#8B7355]/70 backdrop-blur-sm p-6 shadow-xl">
                <h3 className="text-xl font-semibold text-[#FFF8E7] mb-4">Monthly Trends</h3>
                <p className="text-[#FFF8E7] leading-relaxed font-medium">{trends.monthlyTrends}</p>
              </Card>

              <Card className="bg-[#3D2F27]/90 border-[#6B5647]/70 backdrop-blur-sm p-6 shadow-xl">
                <div className="flex items-center mb-4">
                  <Lightbulb className="w-6 h-6 text-[#C8A882] mr-2" />
                  <h3 className="text-xl font-semibold text-[#FFF8E7]">Recommendations</h3>
                </div>
                <ul className="space-y-2">
                  {trends.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[#2F3D2C] mr-2">•</span>
                      <span className="text-[#FFF8E7] font-medium">{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ) : (
            <>
              {!currentEntry ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-[#FFF8E7] mb-2 drop-shadow-lg">Welcome to Your Journal</h3>
                    <p className="text-[#C8A882] mb-6 text-lg">Your daily entry will be created automatically</p>
                    <div className="animate-pulse">
                      <div className="w-32 h-32 bg-[#3D2F27]/50 rounded-full mx-auto mb-4 flex items-center justify-center border border-[#6B5647]/60 shadow-xl">
                        <Calendar className="w-16 h-16 text-[#8B7355]/80" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 h-full flex flex-col">
                  <Card className="bg-[#3D2F27]/80 text-[#FFF8E7] border-[#6B5647]/70 backdrop-blur-sm p-6 flex-1 flex flex-col shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-[#FFF8E7]">Today&apos;s Entry</h3>
                      <span className="text-[#8B7355] text-sm">
                        {currentEntry.timestamp.toLocaleDateString()} at {currentEntry.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <p className="text-[#FFF8E7] text-lg leading-relaxed whitespace-pre-wrap">
                        {currentEntry.content || "Start writing your thoughts for today..."}
                      </p>
                    </div>
                  </Card>

                  {isAnalyzing && (
                    <Card className="bg-[#4A3A2E]/90 border-[#6B5647]/70 backdrop-blur-sm p-6 shadow-xl">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8A882] mr-3"></div>
                        <span className="text-[#FFF8E7] text-lg font-medium">AI is analyzing your entry...</span>
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input with better contrast */}
        {!showTrends && (
          <div className="p-4 border-t border-[#2F3D2C]/50 bg-[#1A1410]/95 backdrop-blur-sm relative shadow-lg">
            <div className="flex space-x-2 relative z-10">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Continue writing your thoughts for today..."
                className="flex-1 bg-[#3D2F27]/60 border-[#6B5647]/70 text-[#FFF8E7] placeholder:text-[#8B7355] focus:border-[#2F3D2C] focus:ring-2 focus:ring-[#2F3D2C]/30 backdrop-blur-sm shadow-md"
              />
              <Button
                onClick={saveEntry}
                disabled={!input.trim() || isAnalyzing}
                className="bg-[#4A3A2E] hover:bg-[#2F3D2C] text-[#FFF8E7] disabled:opacity-50 border border-[#6B5647]/60 shadow-md"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Expandable AI Analysis Panel with enhanced contrast */}
      {aiAnalysisExpanded && currentEntry?.aiAnalysis && !showTrends && (
        <div className="fixed inset-0 z-[40] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-[#1A1410]/90 backdrop-blur-sm"
            onClick={() => setAiAnalysisExpanded(false)}
          />

          <div className="relative w-full max-w-2xl max-h-[80vh] m-4 animate-in slide-in-from-right duration-300">
            <Card className="bg-[#3D2F27]/98 border-[#6B5647]/80 backdrop-blur-md p-6 overflow-y-auto max-h-[80vh] shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Brain className="w-6 h-6 text-[#C8A882] mr-2" />
                  <h3 className="text-2xl font-semibold text-[#FFF8E7]">AI Analysis</h3>
                  <Leaf className="w-5 h-5 ml-2 text-[#2F3D2C]/60" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAiAnalysisExpanded(false)}
                  className="text-[#FFF8E7] hover:bg-[#4A3A2E]/70"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="mb-6">
                <h4 className="text-[#FFF8E7] font-semibold mb-3 flex items-center text-lg">
                  <Heart className="w-5 h-5 mr-2 text-[#B89968]" />
                  Emotions Detected
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentEntry.aiAnalysis.emotions.map((emotion, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-[#4A3A2E] text-[#FFF8E7] font-medium rounded-full text-sm border border-[#6B5647]"
                    >
                      {emotion}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-[#FFF8E7] font-semibold mb-3 text-lg">Overall Feeling</h4>
                <p className="text-[#FFF8E7] leading-relaxed font-medium text-base">
                  {currentEntry.aiAnalysis.feelings}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-[#FFF8E7] font-semibold mb-3 text-lg">Observations</h4>
                <p className="text-[#FFF8E7] leading-relaxed font-medium text-base">
                  {currentEntry.aiAnalysis.observations}
                </p>
              </div>

              <div>
                <h4 className="text-[#FFF8E7] font-semibold mb-3 flex items-center text-lg">
                  <Lightbulb className="w-5 h-5 mr-2 text-[#C8A882]" />
                  Tips for Improvement
                </h4>
                <ul className="space-y-3">
                  {currentEntry.aiAnalysis.improvementTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[#2F3D2C] mr-3 text-lg">•</span>
                      <span className="text-[#FFF8E7] font-medium text-base">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </div>
      )}

      {sidebarOpen && (
        <div className="fixed inset-0 bg-[#1A1410]/70 z-10 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
