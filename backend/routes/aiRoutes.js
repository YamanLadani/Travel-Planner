import express from 'express'
import { chatWithAI } from '../controllers/aiController.js'

const router = express.Router()

// POST /api/ai/chat — public (no auth required for chatbot)
router.post('/chat', chatWithAI)

export default router
