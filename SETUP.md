# 🚀 Quick Setup Guide

## Step 1: Create Backend Environment File

Create a file named `.env` in the `server` folder with this content:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/namasteai
JWT_SECRET=namasteai-super-secret-jwt-key-2024-change-in-production
```

**OR use MongoDB Atlas (Cloud - Recommended):**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a free cluster
4. Get your connection string
5. Replace `MONGO_URI` with your Atlas connection string:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/namasteai?retryWrites=true&w=majority
   ```

## Step 2: Install MongoDB (If using local MongoDB)

### Windows:
1. Download from: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service (usually starts automatically)

### OR use MongoDB Atlas (No installation needed!)

## Step 3: Start Backend Server

Open a terminal and run:

```bash
cd server
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

## Step 4: Start Frontend (in a new terminal)

```bash
npm run dev
```

## Step 5: Test Registration

1. Open http://localhost:5173
2. Click "Register"
3. Fill in your details
4. Register!

---

## Troubleshooting

### "Cannot connect to server" error:
- Make sure backend server is running (Step 3)
- Check if port 5000 is available
- Verify `.env` file exists in `server` folder

### "MongoDB connection error":
- If using local MongoDB: Make sure MongoDB is installed and running
- If using Atlas: Check your connection string is correct
- Check your internet connection (for Atlas)

### Port already in use:
- Change PORT in `server/.env` to another port (e.g., 5001)
- Update `VITE_API_URL` in root `.env` to match

