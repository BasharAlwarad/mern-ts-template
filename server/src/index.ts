import express, { Express, Request, Response } from 'express';
import { mongoDBConnect } from '#db';
import cors from 'cors';

const app: Express = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware - CORS configuration
app.use(
  cors({
    origin: isProduction
      ? process.env.CLIENT_URL || 'http://localhost:5173'
      : true, // Allow all origins in development
    credentials: true,
  })
);
mongoDBConnect();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'MERN TypeScript API Server' });
});

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 catch-all route - must be last
app.use(/.*/, (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

export default app;
