import React from 'react'
import { Sparkles, Lightbulb, TrendingUp, Clock, Zap, Brain } from 'lucide-react'

const AIRecommendation = ({ recommendations = [] }) => {
  const defaultRecommendations = [
    "🌅 Visit the Eiffel Tower at sunset for breathtaking views and fewer crowds",
    "🚢 Take a scenic Seine River cruise in the evening with dinner included",
    "🎨 Explore the vibrant street art in Montmartre district - perfect for photographers",
    "🏰 Don't miss the historic Notre-Dame Cathedral - book tickets in advance",
    "☕ Enjoy authentic French pastries at local cafés in Le Marais neighborhood"
  ]

  const displayRecommendations = recommendations.length > 0 ? recommendations : defaultRecommendations

  return (
    <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-pink-400/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center space-x-4 mb-8">
        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 shadow-xl">
          <Brain className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-2xl font-bold flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-yellow-300" />
            AI-Powered Recommendations
          </h3>
          <p className="text-white/80 text-sm mt-1 flex items-center">
            <Zap className="w-4 h-4 mr-1" />
            Personalized suggestions just for you
          </p>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="relative z-10 space-y-4">
        {displayRecommendations.slice(0, 3).map((rec, index) => (
          <div key={index} className="group">
            <div className="flex items-start space-x-4 p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] transform">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-relaxed group-hover:text-yellow-100 transition-colors">
                  {rec}
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-white/70 font-medium">AI Confidence: High</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <span className="text-sm">→</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="relative z-10 mt-8 pt-6 border-t border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-sm text-white/90">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-4 h-4 text-green-300" />
            </div>
            <div>
              <span className="font-semibold">Based on your preferences</span>
              <p className="text-xs text-white/70">Travel history & ratings analyzed</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-sm text-white/90">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Clock className="w-4 h-4 text-blue-300" />
            </div>
            <div>
              <span className="font-semibold">Updated just now</span>
              <p className="text-xs text-white/70">Real-time suggestions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Badge */}
      <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce">
        ✨ AI POWERED
      </div>
    </div>
  )
}

export { AIRecommendation }