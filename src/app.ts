import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';


const app: Application = express();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

// Parser configurations
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Application Target Routes
app.use('/api/v1', router);

// Global Error Handler
app.use(globalErrorHandler);

// Handle Not Found Routes
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'API Route Not Found!',
    });
});

export default app;