import http from 'http';
import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/database';

dotenv.config();

connectDB();

const PORT: number = parseInt(process.env.PORT || '5000', 10);
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});