import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Setup Socket.IO for future real-time collaboration
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.FRONTEND_URL || 'http://localhost:5173')
    : true, // Allow all origins in development
  credentials: true
}));
app.use(express.json());

import chatRoutes from './routes/chat.routes';
import authRoutes from './routes/auth.routes';

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'StudyVerse API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Catch-all error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

export { httpServer, io, app };
