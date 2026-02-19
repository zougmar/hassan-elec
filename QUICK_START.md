# Quick Start Guide

## Prerequisites
- Node.js (v16+)
- MongoDB (running locally or MongoDB Atlas account)

## Step 1: Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hassan-elec
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
UPLOAD_PATH=./uploads
ADMIN_EMAIL=admin@hassan-elec.com
ADMIN_PASSWORD=admin123
```

Start backend:
```bash
npm run dev
```

## Step 2: Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_WHATSAPP_NUMBER=+1234567890
```

Start frontend:
```bash
npm run dev
```

## Step 3 (Optional): Seed Employee & Admin Module

To create sample Organization, Department, Managers, Employee, and Task:

```bash
cd backend
npm run seed
```

This creates:
- **Admin Manager** (admin panel): manager@hassan-elec.com / manager123
- **Manager** (admin panel): supervisor@hassan-elec.com / supervisor123
- **Employee** (employee panel): employee@hassan-elec.com / employee123

## Step 4: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Login**: http://localhost:3000/admin/login
  - Email: admin@hassan-elec.com (or manager@hassan-elec.com after seed)
  - Password: admin123 (or manager123)
- **Employee Login**: http://localhost:3000/employee/login
  - Email: employee@hassan-elec.com (after running seed)
  - Password: employee123

## Deploy on Vercel (frontend + backend on one URL)

This repo is set up so **one Vercel project** serves both the frontend and the API:

1. Push the code to GitHub and import the repo in Vercel.
2. Vercel builds the frontend and deploys the API at **the same domain** (e.g. `https://hassan-elec.vercel.app`).
3. The frontend automatically uses **`/api`** on that domain, so no extra URL config is needed.

**Environment variables in Vercel (Project → Settings → Environment Variables):**

| Variable | Value |
|----------|--------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A long random secret (min 32 chars) |
| `JWT_EXPIRE` | `7d` |
| `ADMIN_EMAIL` | (optional) Admin login email |
| `ADMIN_PASSWORD` | (optional) Admin login password |

**Do not set** `VITE_API_URL` for this setup — the app uses the same URL for the site and the API.

---

## Vercel: frontend and backend on different URLs

If you deploy the **backend** as a separate Vercel project (e.g. `https://hassan-elec-api.vercel.app`):

1. In the **frontend** Vercel project, add:
   - **`VITE_API_URL`** = `https://hassan-elec-api.vercel.app/api` (your backend URL + `/api`)
2. Redeploy the frontend so the build picks up `VITE_API_URL`.

The frontend will then call your backend at that URL.

---

## Next Steps

1. Change admin credentials after first login
2. Add your services in the admin dashboard
3. Add projects with images
4. Customize the content and styling
5. Update WhatsApp number in `.env`

## Troubleshooting

- **MongoDB not connecting**: Make sure MongoDB is running
- **Port already in use**: Change PORT in backend `.env`
- **Images not loading**: Check that `uploads` folder exists in backend
