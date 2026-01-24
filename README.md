# User Management & Role-Based Access System
Beginner-friendly MERN app with JWT auth, role-based authorization (Admin/User), protected REST APIs, and a modern React UI. Features automatic admin seeding, AI assistant (Gemini/ChatGPT), and chat history management.

## Backend Deployment Link - (https://user-management-app-backend-63sv.onrender.com)
## Frontend Deployment Link - (https://user-management-app-frontend-kappa.vercel.app)

## 📚 Learning Resources

**New to Full Stack Development?** Check out these comprehensive guides:

1. **[COMPLETE_BEGINNER_GUIDE.md](./COMPLETE_BEGINNER_GUIDE.md)** - Complete line-by-line explanation of every file, concept, and code pattern. Perfect for understanding how everything works from scratch.

2. **[VISUAL_LEARNING_GUIDE.md](./VISUAL_LEARNING_GUIDE.md)** - Visual diagrams, flowcharts, and architecture diagrams showing how data flows through the system.

3. **[QUICK_REFERENCE_CHEATSHEET.md](./QUICK_REFERENCE_CHEATSHEET.md)** - Quick code snippets, patterns, and common solutions for daily coding reference.

**Recommended Learning Path:**
1. Start with `COMPLETE_BEGINNER_GUIDE.md` for deep understanding
2. Use `VISUAL_LEARNING_GUIDE.md` for visual reference
3. Keep `QUICK_REFERENCE_CHEATSHEET.md` handy while coding

## Stack
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, express-validator
- Frontend: React (Vite), React Router, Axios, CSS Modules
- AI: Google Gemini API (primary) or OpenAI ChatGPT API (fallback)

## Folder Structure
```
backend/
  src/
    config/
    controllers/
    middlewares/
    models/
    routes/
    services/
    utils/
    validators/
frontend/
  src/
    components/
    context/
    hooks/
    pages/
```

## Setup (Local)
1) Clone or download this folder.
2) Backend setup:
```
cd backend
cp env.example .env    # fill values
npm install
npm run dev            # or npm start
```
3) Frontend setup (in new terminal):
```
cd frontend
cp env.example .env    # set VITE_API_BASE (e.g., http://localhost:5000)
npm install
npm run dev            # Vite starts at 5173
```
4) Open http://localhost:5173.

**Note:** A default admin user is automatically created on first server start. See [ADMIN_CREDENTIALS.md](./ADMIN_CREDENTIALS.md) for details.

## Environment Variables
### backend/.env (template: backend/env.example)
- `PORT` API port (default: 5000)
- `MONGO_URI` MongoDB connection string (Atlas OK)
- `JWT_SECRET` strong secret for signing tokens
- `CLIENT_ORIGIN` allowed origin for CORS (e.g., http://localhost:5173)
- `GEMINI_API_KEY` Google Gemini API key (optional, prioritized if set) - See [GEMINI_API_SETUP.md](./GEMINI_API_SETUP.md)
- `CHATGPT_API_KEY` OpenAI API key (optional, fallback if Gemini not set)
- `CHATGPT_MODEL` OpenAI model id (default: gpt-3.5-turbo)
- `ADMIN_EMAIL` Custom admin email (optional, default: admin@example.com)
- `ADMIN_PASSWORD` Custom admin password (optional, default: admin123)
- `ADMIN_NAME` Custom admin name (optional, default: Admin User)

### frontend/.env (template: frontend/env.example)
- `VITE_API_BASE` backend base URL (no trailing slash)

## API Documentation
Base URL: `http://localhost:5000`

Auth
- `POST /api/auth/register` { name, email, password }
- `POST /api/auth/login` { email, password }
- `GET /api/auth/me` (Bearer token) → current user

Users (Admin only)
- `GET /api/users` → list of users
- `PATCH /api/users/:id/role` { role: "admin" | "user" } → change role
- `DELETE /api/users/:id` → delete user (self-delete blocked)

AI (Admin only)
- `POST /api/ai/ask` { prompt } → { answer }
  - Uses Gemini API if `GEMINI_API_KEY` is set, otherwise falls back to ChatGPT
  - Frontend maintains last 5 chat conversations in accordion format

Health
- `GET /api/health`

## Deployment (Free-tier friendly)
### Backend → Render (similar steps for Railway/Cyclic)
1. Push code to GitHub.
2. In Render: New Web Service → connect repo → root `/backend`.
3. Set Build Command: `npm install` and Start Command: `npm start`.
4. Add env vars (PORT=10000 optional, MONGO_URI, JWT_SECRET, CLIENT_ORIGIN=https://<frontend>, GEMINI_API_KEY or CHATGPT_API_KEY, CHATGPT_MODEL).
5. Deploy; note the public URL for API and update `VITE_API_BASE` in frontend env.

### Database → MongoDB Atlas
1. Create free cluster → Database Deployment → Connect → Drivers.
2. Copy connection string, replace user/password/db in `MONGO_URI`.
3. Add IP allowlist `0.0.0.0/0` (or your server IP only).

### Frontend → Vercel (or Netlify)
1. Push repo to GitHub.
2. In Vercel: New Project → pick repo → set Root Directory to `frontend`.
3. Set env var `VITE_API_BASE=https://<your-backend-host>`.
4. Build command: `npm run build`, Output directory: `dist` (Vercel auto-detects).
5. Deploy. Ensure CORS `CLIENT_ORIGIN` on backend matches the Vercel URL.

## Testing Locally
- **Default Admin:** A default admin user is automatically created on first server start:
  - Email: `admin@example.com`
  - Password: `admin123`
  - See [ADMIN_CREDENTIALS.md](./ADMIN_CREDENTIALS.md) for details and customization
- Login as admin to access `/admin` page and AI assistant
- The admin panel includes:
  - User management (view, change roles, delete users)
  - AI Assistant with chat history (last 5 conversations in accordion format)
  - Modern UI with CSS Modules

## Features

### Authentication & Authorization
- JWT-based authentication with 2-hour token expiration
- Role-based access control (Admin/User roles)
- Protected routes on both frontend and backend
- Automatic admin user seeding on server start

### Admin Dashboard
- User management (view all users, change roles, delete users)
- AI Assistant powered by Gemini/ChatGPT
- Chat history (last 5 conversations in accordion format)
- Modern UI with CSS Modules and responsive design
- Real-time error handling and success notifications

### Security
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens stored in localStorage (beginner-friendly)
- CORS protection
- Input validation on both frontend and backend
- Self-deletion and self-role-change protection

## Notes
- Passwords are hashed with bcrypt (10 salt rounds).
- JWT expires in 2h; stored in localStorage for simplicity (beginner-friendly). For higher security, use httpOnly cookies.
- AI route uses Gemini API if key is provided, otherwise falls back to ChatGPT.
- Chat history is stored in component state (session-only, not persisted to database).

## Additional Resources

- **[ADMIN_CREDENTIALS.md](./ADMIN_CREDENTIALS.md)** - Default admin setup and customization
- **[GEMINI_API_SETUP.md](./GEMINI_API_SETUP.md)** - How to configure Gemini API key
- **[4_HOUR_VIDEO_TEACHING_GUIDE.md](./4_HOUR_VIDEO_TEACHING_GUIDE.md)** - Comprehensive teaching guide for instructors
- **[VIDEO_SESSION_INTRODUCTION.md](./VIDEO_SESSION_INTRODUCTION.md)** - Introduction script for recorded sessions

## Learning Flow (what to read)
1. Start with `COMPLETE_BEGINNER_GUIDE.md` for deep understanding
2. Use `VISUAL_LEARNING_GUIDE.md` for visual reference
3. Keep `QUICK_REFERENCE_CHEATSHEET.md` handy while coding
4. Review `ADMIN_CREDENTIALS.md` for admin setup
5. Check `GEMINI_API_SETUP.md` for AI configuration
