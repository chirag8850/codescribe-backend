import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';

const app = express();


// Middleware Setup
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes Setup
app.use('/api/auth', authRoutes);



export default app;