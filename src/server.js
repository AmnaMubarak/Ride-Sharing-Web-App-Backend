const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const waitForDatabase = require('./utils/db-check');
const logger = require('./utils/logger');
const { errorHandler } = require('./middleware/error.middleware');
const helmet = require('helmet');
const { apiLimiter } = require('./middleware/rateLimiter');
const compression = require('compression');
const config = require('./config/app');
const prisma = require('./lib/prisma');
const redis = require('./lib/redis');

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
app.use(compression());
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
    app.use('/api/rides', require('./routes/ride.routes'));
    app.use('/api/users', require('./routes/user.routes'));

    // Error handling middleware
    app.use(errorHandler);

    // Basic route
    app.get('/', (req, res) => {
      res.json({ message: 'Welcome to Ride Sharing API' });
    });

    // Health check endpoint
    app.get('/health', async (req, res) => {
      try {
        // Check database
        await prisma.$queryRaw`SELECT 1`;
        // Check Redis
        await redis.ping();
        
        res.json({ 
          status: 'healthy',
          timestamp: new Date().toISOString(),
          env: config.env
        });
      } catch (error) {
        res.status(500).json({ 
          status: 'unhealthy',
          error: error.message
        });
      }
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

// Graceful shutdown
const shutdown = async () => {
  try {
    await prisma.$disconnect();
    await redis.quit();
    logger.info('Gracefully shutting down');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startServer();

module.exports = app; 