# Deploy Full Stack on Vercel

Both frontend and backend run on Vercel. The API is served as serverless functions at `/api/*`.

## Prerequisites

- [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier)

## Steps

### 1. Create MongoDB Atlas Database

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get the connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/hassan-elec`)

### 2. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
3. Deploy (default settings should work)

### 3. Add Environment Variables

In Vercel: **Project Settings** → **Environment Variables** → add:

| Name | Value |
|------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A long random string (min 32 characters) |
| `JWT_EXPIRE` | `7d` |

### 4. Redeploy

After adding env vars, go to **Deployments** → **⋯** on the latest deployment → **Redeploy**.

### 5. Seed Data (Optional)

To create admin user and sample data, run locally:

```bash
cd backend
MONGODB_URI="your-atlas-connection-string" npm run seed
```

## Structure

- **Frontend**: Built from `frontend/` → served as static files
- **API**: `api/index.js` → handles all `/api/*` requests (Express serverless)
- **MongoDB**: Hosted on Atlas (required)

## Notes

- **File uploads**: Vercel has ephemeral storage. For production image uploads, use Cloudinary (already in the project).
- **Cold starts**: First API request may be slower (~1–2 sec) due to serverless cold start.
