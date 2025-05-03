import axios from 'axios';

const CHATGPT_API_KEY = process.env.EXPO_PUBLIC_CHATGPT_API_KEY;
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

const chatGptUrl = 'https://api.openai.com/v1/chat/completions';
const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const askChatGPT = async (question: string) => {
  try {
    console.log("ChatGPT API => ",CHATGPT_API_KEY);
    
    const response = await axios.post(
      chatGptUrl,
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }],
      },
      {
        headers: {
          'Authorization': `Bearer ${CHATGPT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const answer = response.data.choices[0].message.content;
    return answer.trim();
  } catch (error: any) {
    console.error('Error asking ChatGPT:', error.response?.data || error.message);
    throw new Error('Failed to get response from ChatGPT.');
  }  
};

export const askGemini = async (question: string) => {
  try {
    const response = await axios.post(
      `${geminiUrl}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: question }],
          },
        ],
        generationConfig: {
          temperature: 0.7,      // Controls creativity (0 = factual, 1 = super creative)
          topK: 40,              // Focus on top 40 words
          topP: 0.95,            // Consider 95% best possibilities
          maxOutputTokens: 2048, // Longer, richer answers
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.data && response.data.candidates && response.data.candidates.length > 0 && response.data.candidates[0].content && response.data.candidates[0].content.parts && response.data.candidates[0].content.parts.length > 0) {
      const answer = response.data.candidates[0].content.parts[0].text;
      
      return answer.trim() || "No answer generated";
    } else {
      console.warn('Unexpected Gemini API response structure:', response.data);
      throw new Error('Failed to parse response from Gemini.');
    }
  } catch (error) {
    console.error('Error asking Gemini:', error);
    throw new Error('Failed to get response from Gemini.');
  }
};