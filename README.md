# 🤖 Assist AI - Full Stack MERN Application

Assist AI is a full-stack MERN (MongoDB, Express, React, Node.js) application that replicates the functionality of Google Gemini, integrating with the Google Gemini API. It offers an intuitive, conversational interface with authentication, theme switching, and conversation history.

## ⚙️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Markdown** - Markdown rendering
- **React Syntax Highlighter** - Code syntax highlighting

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## 💻 Features

- ✅ **Authentication** - User registration, login, and logout
- ✅ **Dark/Light Theme** - Toggle between themes with persistence
- ✅ **Chat Interface** - Conversational AI interface
- ✅ **Image Upload** - Analyze images with AI
- ✅ **Code Formatting** - Syntax-highlighted code blocks
- ✅ **Markdown Support** - Rich text formatting
- ✅ **Voice Search** - Speech-to-text input
- ✅ **Conversation History** - Save and manage chat history
- ✅ **User Settings** - Profile and theme management

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd NamasteAI
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Set up environment variables**

   Create `server/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/namasteai
   # Or MongoDB Atlas:
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/namasteai
   JWT_SECRET=your-super-secret-jwt-key-change-this
   ```

   Create `.env` in root (for frontend):
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_GEMINI_MODEL_NAME=gemini-2.5-pro
   ```

5. **Start MongoDB** (if using local MongoDB)
   ```bash
   # Make sure MongoDB is running on your system
   ```

6. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

7. **Start the frontend** (in a new terminal)
   ```bash
   npm run dev
   ```

8. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
AssistAI/
├── server/                 # Backend
│   ├── controllers/       # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   └── index.js           # Server entry point
├── src/                   # Frontend
│   ├── components/        # React components
│   ├── context/           # Context providers
│   ├── config/            # Configuration files
│   └── assets/            # Static assets
└── package.json
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/theme` - Update user theme

### Conversations
- `GET /api/conversations` - Get all conversations
- `POST /api/conversations` - Create conversation
- `PUT /api/conversations/:id` - Update conversation
- `DELETE /api/conversations/:id` - Delete conversation

## 🎨 Theme System

The app supports light and dark themes with automatic persistence:
- Theme preference is saved in localStorage
- Logged-in users' theme is synced with backend
- CSS variables enable smooth theme transitions

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Input validation

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Links

- Live Demo: https:assistai.onrender.com
- Documentation: [Coming Soon]

---

Made with ❤️ by Chirag Anand  using MERN Stack
