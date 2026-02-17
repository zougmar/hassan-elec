# Deployment Guide – Hassan Elec

This guide covers deploying the MERN app. **Vercel** hosts the frontend; the **backend** must be deployed separately (Railway, Render, or similar).

---

## 1. Deploy Backend (required first)

The backend needs a Node.js runtime and MongoDB. Use one of:

### Option A: Railway (recommended, free tier)

1. Sign up at [railway.app](https://railway.app)
2. Create a new project → **Deploy from GitHub** → select your repo
3. Set **Root Directory** to `backend`
4. Add MongoDB:
   - Click **New** → **Database** → **MongoDB**
   - Railway provides a `MONGODB_URI` automatically
5. Add environment variables (Project → Variables):
   ```
   MONGODB_URI=<from Railway MongoDB>
   JWT_SECRET=your_secure_random_string_min_32_chars
   JWT_EXPIRE=7d
   NODE_ENV=production
   ```
6. Deploy and copy the backend URL (e.g. `https://your-app.railway.app`)

### Option B: Render

1. Sign up at [render.com](https://render.com)
2. **New** → **Web Service** → connect your repo
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add **Environment Variables:**
   - `MONGODB_URI` (use [MongoDB Atlas](https://www.mongodb.com/atlas) free cluster)
   - `JWT_SECRET`, `JWT_EXPIRE`, `NODE_ENV`
5. Deploy and copy the backend URL

### Option C: MongoDB Atlas

- Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Get the connection string and set it as `MONGODB_URI` in your backend environment

---

## 2. Deploy Frontend to Vercel

1. Push your code to GitHub (if not already)
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. **Add New Project** → import your repo
4. Configure:
   - **Root Directory:** `frontend` (or leave empty and set it)
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://YOUR-BACKEND-URL/api` (no trailing slash)

   Example: if backend is `https://hassan-elec-api.railway.app`, use:
   ```
   VITE_API_URL=https://hassan-elec-api.railway.app/api
   ```
6. Deploy

---

## 3. Final Setup

### Backend CORS

Ensure your backend allows the Vercel domain. In `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'https://your-app.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

Or for any origin (simpler for demo):

```javascript
app.use(cors());
```

### Seed Data

After deployment, run the seed script to create admin/manager/employee users:

```bash
cd backend
MONGODB_URI="your-production-mongodb-uri" npm run seed
```

---

## 4. Environment Variables Reference

### Frontend (Vercel)

| Variable         | Description                                      |
|------------------|--------------------------------------------------|
| `VITE_API_URL`   | Backend API base URL (e.g. `https://api.example.com/api`) |
| `VITE_WHATSAPP_NUMBER` | Optional: WhatsApp contact number        |

### Backend (Railway/Render)

| Variable     | Description                          |
|--------------|--------------------------------------|
| `MONGODB_URI`| MongoDB connection string            |
| `JWT_SECRET` | Secret for JWT signing (min 32 chars)|
| `JWT_EXPIRE` | Token expiry (e.g. `7d`)             |
| `NODE_ENV`   | `production`                         |
| `PORT`       | Usually set by the platform          |

---

## 5. Quick Deploy (Vercel CLI)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend (from project root)
cd frontend
vercel

# Add env var when prompted or via dashboard
```
