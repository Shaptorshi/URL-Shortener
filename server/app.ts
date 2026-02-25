import express, { Application, NextFunction } from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import urlRoute from './routes/url.routes'
import authRoute from './routes/auth.routes'


const app: Application = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use('/auth', authRoute);
app.use('/url', urlRoute);


export default app;