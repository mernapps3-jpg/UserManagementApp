const axios = require("axios");
const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../config/env');

// Lazy-init Gemini client so the service works even without a key (demo mode).
const geminiClient = env.geminiApiKey ? new GoogleGenerativeAI(env.geminiApiKey) : null;


async function askAi(prompt) {
  const cleanPrompt = prompt.trim()

  if (geminiClient) {
    const model = geminiClient.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(cleanPrompt);
    const text = result.response?.text?.() || "no response";
    return text.trim();
  }

  if (env.chatGptApiKey) {
    return askChatGpt(cleanPrompt);
  }

  return 'Demo response: add GEMINI_API_KEY or CHATGPT_API_KEY in backend/.env to get live AI answers.';
}

// Minimal wrapper for ChatGPT API (kept for compatibility and fallback).
async function askChatGpt(prompt) {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: env.chatGptModel,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 300
    },
    {
      headers: {
        Authorization: `Bearer ${env.chatGptApiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    }
  );

  const answer = response.data.choices?.[0]?.message?.content || 'No response';
  return answer.trim();
}

module.exports = { askAi }