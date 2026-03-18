import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Sparkles, MapPin, Loader2, Bot, User, Trash2 } from 'lucide-react'
import { useLocation } from '../../hooks/uselocation'

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: '👋 **Hi! I\'m TravelBuddy**, your AI travel assistant!\n\nI can help you with:\n- 🏛️ Finding **famous spots** near any location\n- 🍜 Restaurant and food recommendations\n- 📋 Trip planning and itineraries\n- 🌍 General travel tips\n\nWhat would you like to know?',
        },
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)
    const { userLocation } = useLocation()

    const quickPrompts = [
        '🏛️ Famous spots near me',
        '🍜 Best restaurants nearby',
        '📋 Plan a day trip',
        '🌅 Hidden gems to visit',
    ]

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    const sendMessage = async (text) => {
        const messageText = text || input.trim()
        if (!messageText || isLoading) return

        const userMessage = { role: 'user', content: messageText }
        setMessages((prev) => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: messageText,
                    location: userLocation,
                    chatHistory: messages.slice(-10).map((m) => ({
                        role: m.role === 'assistant' ? 'model' : 'user',
                        content: m.content,
                    })),
                }),
            })

            const data = await response.json()
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: data.response || 'Sorry, I couldn\'t process that. Please try again.' },
            ])
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: '⚠️ I\'m having trouble connecting right now. Please make sure the backend server is running and try again!',
                },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    const clearChat = () => {
        setMessages([
            {
                role: 'assistant',
                content: '🔄 Chat cleared! How can I help you with your travel plans?',
            },
        ])
    }

    // Simple markdown-to-HTML for bold and lists
    const renderMarkdown = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/^- /gm, '• ')
            .replace(/\n/g, '<br/>')
    }

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-[9999] w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 group ${isOpen
                        ? 'bg-gray-800 rotate-0'
                        : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-bounce hover:animate-none'
                    }`}
                style={{ boxShadow: isOpen ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(99,102,241,0.5)' }}
            >
                {isOpen ? (
                    <X className="w-7 h-7 text-white" />
                ) : (
                    <>
                        <MessageCircle className="w-7 h-7 text-white" />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-white" />
                        </div>
                    </>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 z-[9998] w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
                    style={{ animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-4 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">TravelBuddy AI</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-white/80 text-xs">Online • Always ready</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {userLocation && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-white/15 rounded-lg backdrop-blur-sm">
                                    <MapPin className="w-3 h-3 text-white/80" />
                                    <span className="text-white/90 text-xs font-medium">{userLocation.city || 'Located'}</span>
                                </div>
                            )}
                            <button
                                onClick={clearChat}
                                className="p-2 hover:bg-white/15 rounded-lg transition-colors"
                                title="Clear chat"
                            >
                                <Trash2 className="w-4 h-4 text-white/80" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex items-start gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div
                                        className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${msg.role === 'user'
                                                ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                                                : 'bg-gradient-to-br from-indigo-500 to-purple-500'
                                            }`}
                                    >
                                        {msg.role === 'user' ? (
                                            <User className="w-4 h-4 text-white" />
                                        ) : (
                                            <Bot className="w-4 h-4 text-white" />
                                        )}
                                    </div>
                                    <div
                                        className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm'
                                                : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                                    />
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex items-start gap-2">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-white p-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
                                        <span className="text-sm text-gray-500">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Prompts */}
                    {messages.length <= 2 && (
                        <div className="px-4 py-2 flex gap-2 overflow-x-auto flex-shrink-0 border-t border-gray-100 bg-white">
                            {quickPrompts.map((prompt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => sendMessage(prompt)}
                                    className="flex-shrink-0 px-3 py-1.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap border border-transparent hover:border-blue-200"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                sendMessage()
                            }}
                            className="flex items-center gap-2"
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about famous spots, travel tips..."
                                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white border border-transparent focus:border-blue-200 transition-all"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Animation Style */}
            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
        </>
    )
}

export { AIChatbot }
