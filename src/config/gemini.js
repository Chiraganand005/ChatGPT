import { API_KEY, MODEL_NAME } from './api.js';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Helper function to convert image file to base64
async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
}

async function runChat(prompt, imageFile = null, history = []) {
  if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    throw new Error("Please set your Gemini API key in the .env file");
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: "You are a helpful AI assistant. Always format your responses using Markdown. Use code blocks with language tags (```language) for code examples. Use **bold** for emphasis, bullet points for lists, and proper headings. Provide precise, accurate, and well-structured responses. Be concise but thorough. Focus on accuracy and relevance."
  });

  const generationConfig = {
    temperature: 0.7, // Lower temperature for more precise, less random responses
    topK: 40, // Increased for better token selection
    topP: 0.95, // Slightly reduced for more focused responses
    maxOutputTokens: 4096, // Increased for more detailed responses when needed
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  let result;

  if (imageFile) {
    // Handle image with prompt
    const imagePart = await fileToGenerativePart(imageFile);
    const parts = [imagePart];

    if (prompt) {
      parts.push({ text: prompt });
    }

    result = await model.generateContent({
      contents: [{ role: 'user', parts }],
      generationConfig,
      safetySettings,
    });
  } else {
    // Handle text-only prompt
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: history || [],
    });

    result = await chat.sendMessage(prompt);
  }

  const response = result.response;
  console.log(response.text());
  return response.text();
}

export default runChat;