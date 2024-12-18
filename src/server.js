const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const waitForDatabase = require('./utils/db-check');
const logger = require('./utils/logger');
const { errorHandler } = require('./middleware/error.middleware');
const helmet = require('helmet');
const { apiLimiter } = require('./middleware/rateLimiter');

require('dotenv').config();

const app = express();

// Move CORS before all other middleware
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://192.168.56.1:3000',
      'http://127.0.0.1:3000'
    ];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
}));

// Other middleware
app.use(helmet());
app.use('/api', apiLimiter);
app.use(express.json({ limit: '10kb' }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    body: req.body,
    query: req.query,
    headers: req.headers
  });
  next();
});

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