import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import { routeNotFound } from './app/middleware/routeNotFound';
import router from './app/routes';

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true, // allow cookies from the client
  }),
);

// Routes
app.use('/api/v1', router);

app.get('/', async (req: Request, res: Response) => {
  res.send('Server is running...');
});

// 404 Route
app.use('*', routeNotFound);

// Error Handler
app.use(globalErrorHandler);

export default app;
