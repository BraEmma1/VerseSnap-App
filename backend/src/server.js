import app from './app.js';
import { PORT } from './config/env.js';
import connectDB from './config/db.js';

// Connect to Database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});
