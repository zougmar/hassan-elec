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
