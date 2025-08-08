import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Google Gemini API endpoint and API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';
// const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
// const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// function cleanText(text) {
//   return text
//     .replace(/[^\w\s\n]/gi, '') // Removes all special characters, but keeps letters, numbers, spaces, and newlines.
//     .replace(/\s{2,}/g, ' ')   // Replaces multiple spaces with a single space.
//     .trim();                   // Trims whitespace from the beginning and end of the string.
// }


// Route to handle user input
app.post('/api/ask', async (req, res) => {
  const { user_input } = req.body;
  const message = user_input;

  console.log("Received message:", message);

  const prompt = `Based on the following user message, provide clear and actionable step-by-step advice.

User message: "${message}"

Your response must be a series of short, bullet-pointed statements. Each statement should be a direct and specific piece of advice. Avoid any introductory or concluding sentences, lengthy explanations, or broad, roadmap-style guidance. Get straight to the point with only the essential information needed to act.

Example of desired response format:
- Step 1: Do this.
- Step 2: Do that.
- Step 3: Do something else.
- Step 4: Final action.
- Step 5: Last instruction.
`;
  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    const apiUrl = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
    console.log("Calling Gemini API:", apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const data = await response.json();
    console.log("Gemini response:", data);

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return res.json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      return res.status(500).json({ error: 'No valid response from Gemini', raw: data });
    }

  } catch (error) {
    console.error('Error fetching from Gemini:', error);
    res.status(500).json({ error: 'Failed to fetch from Gemini API' });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
