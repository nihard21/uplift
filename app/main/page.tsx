"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Menu, LogOut, BookOpen, Brain, Lightbulb, Heart, TrendingUp, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Initialize or get today's entry
  useEffect(() => {
    const today = new Date()
    const todayKey = today.toDateString()

    // Check if we already have today's entry
    const existingEntry = journalEntries.find((entry) => entry.timestamp.toDateString() === todayKey)

    if (!existingEntry) {
      // Create new daily entry with unique ID
      const newEntry: JournalEntry = {
        id: `${todayKey}-${Date.now()}`, // Make ID unique with timestamp
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

  const saveEntry = async () => {
    if (!input.trim() || !currentEntry) return

    // Update current entry with new content
    const updatedEntry: JournalEntry = {
      ...currentEntry,
      content: currentEntry.content + (currentEntry.content ? "\n\n" : "") + input.trim(),
      timestamp: new Date(),
    }

    setJournalEntries((prev) => prev.map((entry) => (entry.id === currentEntry.id ? updatedEntry : entry)))

    setCurrentEntry(updatedEntry)
    setInput("")
    setIsAnalyzing(true)

    // Enhanced AI analysis with Mistral integration
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
      // Fallback to basic analysis
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

  // Mistral AI analysis using our utility functions
  const analyzeWithMistral = async (content: string) => {
    // Create a more focused and content-specific prompt
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
      // Import our utility functions
      const { aiAnalysis } = await import("@/lib/huggingface")

      const result = await aiAnalysis(prompt, "distilbert-base-uncased")

      // Parse the response and extract JSON
      try {
        const analysisText = result.generated_text || ""

        // Look for JSON in the response
        let jsonMatch = analysisText.match(/\{[\s\S]*\}/)

        if (!jsonMatch) {
          // If no JSON found, try to extract from the full response
          jsonMatch = result.generated_text?.match(/\{[\s\S]*\}/)
        }

        if (jsonMatch) {
          const parsedAnalysis = JSON.parse(jsonMatch[0])

          // Validate the response structure
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

  // Fallback basic analysis
  const getBasicAnalysis = (content: string) => {
    const text = content.toLowerCase()
    let emotions: string[] = []
    let feelings = ""
    let observations = ""
    let improvementTips: string[] = []
    let sentimentScore = 0.5

    // Analyze specific content patterns
    const contentAnalysis = {
      // Work/Professional
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

      // Relationships
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

      // Health/Wellness
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

      // Personal Growth/Goals
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

    // Analyze which category best matches the content
    let bestMatch = null
    let highestScore = 0

    for (const [category, data] of Object.entries(contentAnalysis)) {
      const score = data.keywords.filter((keyword) => text.includes(keyword)).length
      if (score > highestScore) {
        highestScore = score
        bestMatch = { category, data }
      }
    }

    // If we have a clear content match, use that analysis
    if (bestMatch && highestScore >= 2) {
      const { data } = bestMatch

      // Select random emotions from the category
      emotions = data.emotions.sort(() => Math.random() - 0.5).slice(0, 3)

      // Select random feeling description
      feelings = data.feelings[Math.floor(Math.random() * data.feelings.length)]

      // Select random observation
      observations = data.observations[Math.floor(Math.random() * data.observations.length)]

      // Select random tips
      improvementTips = data.tips.sort(() => Math.random() - 0.5).slice(0, 4)

      // Adjust sentiment based on content
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
      // Fallback to general emotional analysis if no clear category
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
      // const reflectiveCount = emotionKeywords.reflective.filter(word => text.includes(word)).length

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

  // Get trend analysis
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
    const recentEntries = entriesWithAnalysis.slice(0, 7) // Last 7 entries

    // Calculate average sentiment
    const avgSentiment =
      recentEntries.reduce((sum, entry) => sum + (entry.aiAnalysis?.sentimentScore || 0.5), 0) / recentEntries.length

    let overallMood = "Neutral"
    if (avgSentiment > 0.7) overallMood = "Generally Positive"
    else if (avgSentiment < 0.3) overallMood = "Generally Challenging"
    else overallMood = "Mixed"

    // Analyze emotional patterns
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
    <div className="h-screen w-full relative overflow-hidden">
      {/* Animated Fireplace Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Base fireplace background - solid black */}
        <div className="absolute inset-0 bg-black" />

        {/* Simple smooth orange glow from bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-orange-600/40 via-orange-500/25 via-orange-400/15 via-orange-300/8 via-orange-200/4 via-orange-100/2 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-red-600/30 via-red-500/20 via-red-400/12 via-red-300/6 via-red-200/3 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-yellow-600/20 via-yellow-500/12 via-yellow-400/8 via-yellow-300/4 via-yellow-200/2 to-transparent" />

        {/* Main fire bed spanning across entire bottom - taller for higher flames */}
        <div className="absolute bottom-0 left-0 right-0 h-72 overflow-hidden">
          {/* Fire logs base with ultra-smooth gradients */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-r from-amber-900/60 via-amber-850/65 via-amber-800/70 via-orange-900/80 via-orange-850/85 via-orange-800/88 via-red-900/90 via-red-850/88 via-red-800/85 via-orange-900/80 via-orange-850/75 via-orange-800/70 via-amber-900/60 via-amber-850/55 to-amber-800/50 opacity-70" />
          <div className="absolute bottom-2 left-0 right-0 h-8 bg-gradient-to-r from-red-900/50 via-red-850/55 via-red-800/60 via-orange-800/70 via-orange-750/75 via-orange-700/78 via-amber-800/80 via-amber-750/78 via-amber-700/75 via-orange-800/70 via-orange-750/65 via-orange-700/60 via-red-900/50 via-red-850/45 to-red-800/40 opacity-60" />
          <div className="absolute bottom-4 left-0 right-0 h-6 bg-gradient-to-r from-amber-800/40 via-amber-750/45 via-amber-700/50 via-red-800/60 via-red-750/65 via-red-700/68 via-orange-700/70 via-orange-650/68 via-orange-600/65 via-red-800/60 via-red-750/55 via-red-700/50 via-amber-800/40 via-amber-750/35 to-amber-700/30 opacity-50" />

          {/* Gap-filling flames with original gradients - moved down to connect with orange glow */}
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
                className={`flame flame-${(i % 7) + 1} absolute bottom-2 bg-gradient-to-t from-red-700 via-orange-500 to-yellow-300 opacity-85`}
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

          {/* Inner core flames with original gradients - moved down */}
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
                className={`flame flame-inner-${(i % 4) + 1} absolute bottom-2 bg-gradient-to-t from-yellow-400 via-orange-300 to-yellow-100 opacity-90`}
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

        {/* Enhanced glowing embers scattered randomly across screen */}
        <div className="absolute inset-0">
          {Array.from({ length: 60 }, (_, i) => {
            // Random positioning across full screen width
            const xPosition = Math.random() * 100

            // Random positioning in upper portion of screen (above flames, below top)
            // Keep them between 20% and 70% of screen height
            const yPosition = 20 + Math.random() * 50

            const size = 1 + Math.random() * 3
            const delay = Math.random() * 8
            const duration = 3 + Math.random() * 4

            return (
              <div
                key={`ember-${i}`}
                className="ember absolute bg-orange-400 rounded-full animate-ping"
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
      </div>

      {/* Enhanced Blur Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[0.5px] z-[1]" />

      {/* Sidebar */}
      <div
        className={`absolute left-0 top-0 h-full w-80 bg-black/80 backdrop-blur-md border-r border-white/20 transform transition-transform duration-300 z-[30] ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              UpLift Journal
            </h1>
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
                <span className="text-xs text-white/80 mt-1">Logout</span>
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

          {/* Daily Entry Info */}
          {/* Navigation */}
          {/* Daily Entry Info */}
          <div
            className="bg-orange-600/30 hover:bg-orange-600/40 rounded-lg p-3 mb-4 cursor-pointer transition-colors border border-orange-500/50"
            onClick={() => {
              setShowTrends(false)
              setShowAIAnalysis(false)
            }}
          >
            <div className="flex items-center mb-2">
              <Calendar className="w-4 h-4 text-orange-300 mr-2" />
              <span className="text-white text-sm font-medium">Today&apos;s Entry</span>
            </div>
            <p className="text-white/90 text-xs">
              {currentEntry?.timestamp.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Navigation - Remove AI Analysis tab */}
          <div className="space-y-2">
            <Button
              onClick={() => {
                setShowTrends(true)
                setShowAIAnalysis(false)
              }}
              className={`w-full justify-start ${showTrends ? "bg-orange-600/80 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
              variant="ghost"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Trends & Insights
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <h3 className="text-white text-sm font-medium mb-3">Recent Entries</h3>
          {journalEntries.slice(0, 10).map((entry, index) => (
            <Card
              key={`${entry.id}-${index}`}
              className={`p-3 cursor-pointer transition-colors bg-white/10 border-white/20 hover:bg-white/20 ${
                currentEntry?.id === entry.id ? "bg-white/25" : ""
              }`}
              onClick={() => {
                setCurrentEntry(entry)
                setShowTrends(false)
                setSidebarOpen(false)
              }}
            >
              <p className="text-white text-sm font-medium truncate">
                {entry.timestamp.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-white/80 text-xs">
                {entry.content.slice(0, 25) + (entry.content.length > 25 ? "..." : "")}
              </p>
              {entry.aiAnalysis && (
                <div className="flex items-center mt-2">
                  <Brain className="w-3 h-3 text-green-300 mr-1" />
                  <span className="text-xs text-green-300">AI Analyzed</span>
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
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-2 text-white hover:bg-white/10"
              >
                <Menu className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-semibold text-white flex items-center">
                {showTrends ? (
                  <>
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Trends & Insights
                  </>
                ) : (
                  <>
                    <BookOpen className="w-5 h-5 mr-2" />
                    Today&apos;s Journal Entry
                  </>
                )}
              </h2>
            </div>
            {currentEntry && (
              <span className="text-white/80 text-sm">
                {currentEntry.timestamp.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {showTrends ? (
            // Trends & Insights View
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-orange-600/30 to-red-600/30 border-orange-500/50 backdrop-blur-sm p-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-6 h-6 text-orange-300 mr-2" />
                  <h3 className="text-xl font-semibold text-white">Overall Mood</h3>
                </div>
                <p className="text-white text-lg mb-2">{trends.overallMood}</p>
                <div className="flex flex-wrap gap-2">
                  {trends.emotionalPatterns.map((emotion, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-500/30 text-orange-200 rounded-full text-sm border border-orange-500/50"
                    >
                      {emotion}
                    </span>
                  ))}
                </div>
              </Card>

              <Card className="bg-gradient-to-r from-red-600/30 to-yellow-600/30 border-red-500/50 backdrop-blur-sm p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Weekly Insights</h3>
                <p className="text-white/90 leading-relaxed">{trends.weeklyInsights}</p>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border-yellow-500/50 backdrop-blur-sm p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Monthly Trends</h3>
                <p className="text-white/90 leading-relaxed">{trends.monthlyTrends}</p>
              </Card>

              <Card className="bg-gradient-to-r from-amber-600/30 to-red-600/30 border-amber-500/50 backdrop-blur-sm p-6">
                <div className="flex items-center mb-4">
                  <Lightbulb className="w-6 h-6 text-yellow-300 mr-2" />
                  <h3 className="text-xl font-semibold text-white">Recommendations</h3>
                </div>
                <ul className="space-y-2">
                  {trends.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-300 mr-2">•</span>
                      <span className="text-white/90">{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ) : (
            // Journal Entry View
            <>
              {!currentEntry ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-white mb-2">Welcome to Your Journal</h3>
                    <p className="text-white/90 mb-6 text-lg">Your daily entry will be created automatically</p>
                    <div className="animate-pulse">
                      <div className="w-32 h-32 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-white/40" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Journal Entry */}
                  <Card className="bg-white/20 text-white border-white/30 backdrop-blur-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">Today&apos;s Entry</h3>
                      <span className="text-white/80 text-sm">
                        {currentEntry.timestamp.toLocaleDateString()} at {currentEntry.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-white text-lg leading-relaxed whitespace-pre-wrap">
                      {currentEntry.content || "Start writing your thoughts for today..."}
                    </p>
                  </Card>

                  {/* AI Analysis */}
                  {currentEntry.aiAnalysis && (
                    <Card className="bg-gradient-to-r from-orange-600/30 to-red-600/30 border-orange-500/50 backdrop-blur-sm p-6">
                      <div className="flex items-center mb-4">
                        <Brain className="w-6 h-6 text-orange-300 mr-2" />
                        <h3 className="text-xl font-semibold text-white">AI Analysis</h3>
                      </div>

                      {/* Emotions */}
                      <div className="mb-4">
                        <h4 className="text-white font-medium mb-2 flex items-center">
                          <Heart className="w-4 h-4 mr-2 text-red-300" />
                          Emotions Detected
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {currentEntry.aiAnalysis.emotions.map((emotion, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-red-500/30 text-red-200 rounded-full text-sm border border-red-500/50"
                            >
                              {emotion}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Feelings */}
                      <div className="mb-4">
                        <h4 className="text-white font-medium mb-2">Overall Feeling</h4>
                        <p className="text-white/90 leading-relaxed">{currentEntry.aiAnalysis.feelings}</p>
                      </div>

                      {/* Observations */}
                      <div className="mb-4">
                        <h4 className="text-white font-medium mb-2">Observations</h4>
                        <p className="text-white/90 leading-relaxed">{currentEntry.aiAnalysis.observations}</p>
                      </div>

                      {/* Improvement Tips */}
                      <div>
                        <h4 className="text-white font-medium mb-2 flex items-center">
                          <Lightbulb className="w-4 h-4 mr-2 text-yellow-300" />
                          Tips for Improvement
                        </h4>
                        <ul className="space-y-2">
                          {currentEntry.aiAnalysis.improvementTips.map((tip, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-yellow-300 mr-2">•</span>
                              <span className="text-white/90">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  )}

                  {/* Analysis in Progress */}
                  {isAnalyzing && (
                    <Card className="bg-gradient-to-r from-orange-600/30 to-red-600/30 border-orange-500/50 backdrop-blur-sm p-6">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-300 mr-3"></div>
                        <span className="text-white text-lg">AI is analyzing your entry...</span>
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input - Only show for journal entries */}
        {!showTrends && (
          <div className="p-4 border-t border-white/10 bg-black/50 backdrop-blur-sm relative">
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
                placeholder="Continue writing your thoughts for today..."
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:border-orange-400/50 backdrop-blur-sm"
              />
              <Button
                onClick={saveEntry}
                disabled={!input.trim() || isAnalyzing}
                className="bg-orange-600/80 hover:bg-orange-600 text-white disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
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
