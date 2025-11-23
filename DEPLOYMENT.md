# Deployment Guide for NamasteAI

This guide outlines the steps to deploy the NamasteAI application. The project consists of a React frontend (Vite) and an Express backend.

## Prerequisites

- Node.js installed (v16 or higher recommended)
- A MongoDB database (e.g., MongoDB Atlas)
- A Gemini API Key

## Environment Variables

### Backend (`server/.env`)

When deploying the backend, ensure the following environment variables are set:

- `PORT`: The port the server should listen on (usually set automatically by the platform).
- `MONGO_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A strong secret key for JWT authentication (if applicable).

### Frontend (`.env` or Platform Config)

When deploying the frontend, you need to set the following:

- `VITE_API_URL`: The full URL of your deployed backend (e.g., `https://your-backend-app.onrender.com/api`).
- `VITE_GEMINI_API_KEY`: Your Gemini API key.
- `VITE_GEMINI_MODEL_NAME`: (Optional) The model name, defaults to `gemini-1.5-pro`.

## Deployment Options

### Option 1: Render (Recommended for ease of use)

Render allows you to deploy both the backend and frontend easily.

#### Backend Deployment
1.  Create a new **Web Service** on Render.
2.  Connect your GitHub repository.
3.  Set the **Root Directory** to `server`.
4.  Set the **Build Command** to `npm install`.
5.  Set the **Start Command** to `node index.js`.
6.  Add the **Environment Variables** (`MONGO_URI`, etc.).
7.  Deploy. Note the URL provided by Render (e.g., `https://namasteai-backend.onrender.com`).

#### Frontend Deployment
1.  Create a new **Static Site** on Render.
2.  Connect your GitHub repository.
3.  Set the **Build Command** to `npm run build`.
4.  Set the **Publish Directory** to `dist`.
5.  Add the **Environment Variables**:
    - `VITE_API_URL`: The URL of your deployed backend + `/api` (e.g., `https://namasteai-backend.onrender.com/api`).
    - `VITE_GEMINI_API_KEY`: Your Gemini API Key.
6.  Deploy.

### Option 2: Vercel (Frontend) + Render/Heroku (Backend)

You can host the frontend on Vercel and the backend on another service.

#### Frontend (Vercel)
1.  Import your project into Vercel.
2.  Set the **Framework Preset** to Vite.
3.  Add the **Environment Variables** (`VITE_API_URL`, `VITE_GEMINI_API_KEY`).
4.  Deploy.

## Verification

After deployment:
1.  Open the frontend URL.
2.  Check the console for any errors.
3.  Try to log in or start a chat to verify the backend connection.
