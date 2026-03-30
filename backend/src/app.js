import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
/* works when I add this */
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "1.0.0.1"]);


const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json()); // Parses incoming JSON payloads
app.use(express.urlencoded({ extended: true }));

// Health check route (so Render and default browsers don't show "Cannot GET /")
app.get('/', (req, res) => {
  res.status(200).json({ status: 'VerseSnap API is running correctly!' });
});

// Central API Router
app.use('/api', routes);

// Global Error Handling Middleware
// Must be used after all routes and routes' middlewares
app.use(errorHandler);

export default app;
