import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/services.js';
import projectRoutes from './routes/projects.js';
import requestRoutes from './routes/requests.js';
import organizationRoutes from './routes/organizations.js';
import departmentRoutes from './routes/departments.js';
import managerRoutes from './routes/managers.js';
import employeeRoutes from './routes/employees.js';
import taskRoutes from './routes/tasks.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS - allow all origins for Vercel
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection for serverless (reused across invocations)
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hassan-elec';
    cached.promise = mongoose.connect(uri).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection error:', err);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Serve uploaded files: on Vercel use /tmp/uploads (writable), locally use backend/uploads
const uploadsStaticDir = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsStaticDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/managers', managerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

export default app;
