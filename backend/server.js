import 'dotenv/config';
import http from 'http';
import mongoose from 'mongoose';
import app from './app.js';
import { initSocket } from './utils/socket.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hassan-elec';
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const initAdmin = (await import('./utils/initAdmin.js')).default;
    await initAdmin();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

initSocket(server).catch((err) => console.error('Socket.io init error:', err));

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
