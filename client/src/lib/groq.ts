import { Groq } from 'groq-sdk';

const groqApiKey = import.meta.env.VITE_GROQ_API;

if (!groqApiKey) {
  throw new Error('Missing Groq API key');
}

const groq = new Groq({
  apiKey: groqApiKey,
  dangerouslyAllowBrowser: true // Enable browser usage
});

const SYSTEM_PROMPT = `You are SnapGuard's AI assistant, specialized in cybersecurity and digital threat protection. 
Your role is to help users understand cybersecurity concepts, identify potential threats, and provide guidance on digital security.

If users ask questions unrelated to cybersecurity or SnapGuard's features, respond with:
"SnapGuard is a digital cyber threat assistant that is ready to protect you from digital threats. Kindly ask questions related to Cyber Security or any threats that our platform has detected from your system."

For cybersecurity-related questions, provide clear, accurate, and helpful responses.`;

export async function getChatResponse(message: string): Promise<string> {
  try {
    const response = await fetch('/api/chat/response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from AI assistant');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Chat API error:', error);
    throw new Error('Failed to get response from AI assistant');
  }
} 