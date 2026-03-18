import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_PROMPT = `You are TravelBuddy, a friendly and knowledgeable AI travel assistant. You help users with:
- Finding famous spots, landmarks, and hidden gems near any location
- Providing travel tips, best times to visit, and local customs
- Suggesting itineraries and day plans
- Recommending restaurants, hotels, and activities
- Answering general travel questions

Rules:
- Be concise but informative — aim for 2-4 paragraphs max
- Use emoji sparingly to make responses engaging (🏛️ 🌅 🍜 etc.)
- When listing places, organize them with bullet points
- If the user provides their location, tailor suggestions to nearby places
- Always mention practical info like opening hours, costs, or distances when relevant
- If you don't know something specific, say so honestly`

// Helper to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Models to try in order (1.5-flash has more generous rate limits)
const MODELS = ['gemini-1.5-flash', 'gemini-2.0-flash']
const MAX_RETRIES = 2
const BASE_DELAY_MS = 1000

export const chatWithAI = async (req, res) => {
    try {
        const { message, location, chatHistory = [] } = req.body

        if (!message) {
            return res.status(400).json({ message: 'Message is required' })
        }

        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
            console.log('[AI] No valid API key configured, using fallback')
            return res.status(200).json({
                response: getFallbackResponse(message, location),
                source: 'fallback'
            })
        }

        const genAI = new GoogleGenerativeAI(apiKey)

        // Build context with user location
        let contextMessage = SYSTEM_PROMPT
        if (location) {
            contextMessage += `\n\nThe user's current location is: ${location.city || 'Unknown city'}, ${location.country || 'Unknown country'} (lat: ${location.latitude}, lon: ${location.longitude}).`
        }

        // Build chat history for context
        const contents = []

        // Add system instruction as first user message for context
        contents.push({
            role: 'user',
            parts: [{ text: contextMessage + '\n\nPlease acknowledge that you understand your role.' }]
        })
        contents.push({
            role: 'model',
            parts: [{ text: 'I understand! I\'m TravelBuddy, your AI travel assistant. I\'m here to help you discover amazing places, plan trips, and answer any travel questions. How can I help you today? 🌍' }]
        })

        // Add previous chat history
        for (const msg of chatHistory.slice(-10)) {
            contents.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            })
        }

        // Add current message
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        })

        // Try each model with retries
        let lastError = null
        for (const modelName of MODELS) {
            for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
                try {
                    console.log(`[AI] Trying ${modelName} (attempt ${attempt}/${MAX_RETRIES})`)
                    const model = genAI.getGenerativeModel({ model: modelName })
                    const result = await model.generateContent({ contents })
                    const response = result.response.text()

                    console.log(`[AI] Success with ${modelName} on attempt ${attempt}`)
                    return res.status(200).json({
                        response,
                        source: 'gemini'
                    })
                } catch (error) {
                    lastError = error
                    console.error(`[AI] ${modelName} attempt ${attempt} failed:`, error.message)

                    // Only retry on rate limit / resource exhausted errors
                    const isRetryable = error.message?.includes('429') ||
                        error.message?.includes('Resource has been exhausted') ||
                        error.message?.includes('rate limit') ||
                        error.message?.includes('RESOURCE_EXHAUSTED') ||
                        error.status === 429

                    if (isRetryable && attempt < MAX_RETRIES) {
                        const waitTime = BASE_DELAY_MS * Math.pow(2, attempt - 1) // 2s, 4s, 8s
                        console.log(`[AI] Rate limited. Waiting ${waitTime}ms before retry...`)
                        await delay(waitTime)
                    } else if (!isRetryable) {
                        // Non-retryable error (bad key, model not found, etc.) — stop immediately
                        throw error
                    }
                }
            }
            console.log(`[AI] All retries exhausted for ${modelName}, trying next model...`)
        }

        // All models and retries failed
        throw lastError || new Error('All Gemini models failed')
    } catch (error) {
        console.error('[AI] Gemini API error:', error.message)

        // Return error info so the user knows what happened
        return res.status(200).json({
            response: `⚠️ **AI temporarily unavailable**\n\nThe AI service is experiencing high demand (rate limited). Please try again in a minute.\n\n---\n\n${getFallbackResponse(req.body.message, req.body.location)}`,
            source: 'fallback',
            error: error.message
        })
    }
}

function getFallbackResponse(message, location) {
    const msg = message.toLowerCase()
    const city = location?.city || 'your city'

    if (msg.includes('famous') || msg.includes('landmark') || msg.includes('spot') || msg.includes('visit')) {
        return `🏛️ **Great question!** Here are some tips for finding famous spots:\n\n- Use the **Nearby Spots** feature in our app to discover attractions near your location\n- Check out the **Explore** page for curated destinations worldwide\n- Popular categories include: Temples, Museums, Parks, Monuments, and Historical sites\n\n${location ? `Since you're in ${city}, try searching for local landmarks on the Nearby page!` : 'Set your location to get personalized nearby recommendations!'}\n\n💡 *Tip: Add a Gemini API key in settings for more detailed AI-powered recommendations!*`
    }

    if (msg.includes('restaurant') || msg.includes('food') || msg.includes('eat')) {
        return `🍜 **Looking for great food?**\n\n- Check out the **Explore** page and filter by "Food" category\n- Use the **Nearby Spots** feature to find restaurants close to you\n- Local street food is often the best way to experience a new place!\n\n${location ? `In ${city}, try exploring local cuisine and must-visit restaurants.` : ''}\n\n💡 *Tip: Add a Gemini API key for personalized restaurant recommendations!*`
    }

    if (msg.includes('hotel') || msg.includes('stay') || msg.includes('accommodation')) {
        return `🏨 **Finding accommodation?**\n\n- Enter your hotel location in the **Nearby Spots** page to discover attractions within walking distance\n- This helps you plan day trips from your base\n- Consider staying in central areas for easy access to landmarks\n\n💡 *Tip: Add a Gemini API key for tailored hotel advice!*`
    }

    if (msg.includes('itinerary') || msg.includes('plan') || msg.includes('trip')) {
        return `📋 **Trip Planning Tips:**\n\n- Head to **Trips** in the navigation to create a new trip plan\n- Use **Nearby Spots** to discover what's around your accommodation\n- Save places you love using the ❤️ save button\n- Group attractions by proximity to minimize travel time\n\n${location ? `For ${city}: Start with must-see landmarks, then explore hidden gems!` : ''}\n\n💡 *Tip: Add a Gemini API key for AI-generated itineraries!*`
    }

    return `👋 **Hi! I'm TravelBuddy, your travel assistant!**\n\nI can help you with:\n- 🏛️ Finding **famous spots** near any location\n- 🍜 **Restaurant** and food recommendations\n- 📋 **Trip planning** and itineraries\n- 🏨 **Accommodation** advice\n- 🌍 General **travel tips**\n\nTry asking me something like:\n- "What are famous spots near me?"\n- "Best restaurants in Paris"\n- "Plan a 3-day trip to Tokyo"\n\n${location ? `I see you're in ${city} — ask me about things to do there!` : 'Set your location for personalized suggestions!'}\n\n💡 *For the best experience, add a Gemini API key in your backend .env file!*`
}
