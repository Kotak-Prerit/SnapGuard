const express = require('express');
const router = express.Router();
const { Groq } = require('groq-sdk');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env')
});

// Verify GROQ_API_KEY is available
if (!process.env.GROQ_API_KEY) {
  console.error('GROQ_API_KEY is not set in environment variables');
  throw new Error('GROQ_API_KEY is required');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `You are SnapGuard's AI assistant, specialized in cybersecurity and digital threat protection. 
Your role is to help users understand cybersecurity concepts, identify potential threats, and provide guidance on digital security.

If users ask questions unrelated to cybersecurity or SnapGuard's features, respond with:
"SnapGuard is a digital cyber threat assistant that is ready to protect you from digital threats. Kindly ask questions related to Cyber Security or any threats that our platform has detected from your system."

For cybersecurity-related questions, provide clear, accurate, and helpful responses.`;

router.post('/response', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 1024,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    res.json({ response });
  } catch (error) {
    console.error('Groq API error:', error);
    res.status(500).json({ error: 'Failed to get response from AI assistant' });
  }
});

module.exports = router; 