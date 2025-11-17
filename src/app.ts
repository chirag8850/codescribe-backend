import express, { Application } from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import uploadRoutes from './routes/upload.routes';

const app: Application = express();


// Middleware Setup
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes Setup
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);



export default app;