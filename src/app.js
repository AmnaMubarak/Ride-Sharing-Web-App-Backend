const app = require('./server');
const config = require('./config/index');
const logger = require('./utils/logger');

const startServer = async () => {
  try {
    const server = app.listen(config.port, () => {

      logger.info(`Server running in ${config.env} mode on port ${config.port}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('UNHANDLED REJECTION! Shutting down...');
      logger.error(err);
      
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 