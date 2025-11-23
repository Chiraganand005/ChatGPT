// src/config/api.js

// Get API key from environment variable or use placeholder
// To use environment variable, create a .env file in the root directory with:
// VITE_GEMINI_API_KEY=your_api_key_here
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Model name for Gemini API
// Available models: 
// - "gemini-1.5-pro" (Most precise, slower) - Recommended for accuracy
// - "gemini-1.5-flash" (Fast, good balance)
// - "gemini-2.0-flash-exp" (Experimental)
// - "gemini-2.5-flash" (Latest flash model)
// IMPORTANT: Model names must be lowercase with hyphens (e.g., "gemini-1.5-pro"), NOT "Gemini 1.5 Pro"
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL_NAME || "gemini-2.5-pro";

// Export the configuration
export { API_KEY, MODEL_NAME };
