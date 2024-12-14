const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const waitForDatabase = require('./utils/db-check');
const logger = require('./utils/logger');
const { errorHandler } = require('./middleware/error.middleware');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    await waitForDatabase();

    // Routes
    app.use('/api/auth', authRoutes);

    // Error handling middleware
    app.use(errorHandler);

    // Basic route
    app.get('/', (req, res) => {
      res.json({ message: 'Welcome to Ride Sharing API' });
    });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 