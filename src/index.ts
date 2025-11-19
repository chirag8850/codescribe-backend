import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import http from 'http';

import { connectDB } from './config/database';
import authRoutes from './routes/auth.routes';
import uploadRoutes from './routes/upload.routes';
import profileRoutes from './routes/profile.routes';

connectDB();

const app: Application = express();

// Middleware Setup
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes Setup
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/', profileRoutes);

const PORT: number = parseInt(process.env.PORT || '5000', 10);
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
