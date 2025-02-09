const redis = require('../lib/redis');
const logger = require('../utils/logger');

const cache = (duration = 3600) => {
  return async (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cachedData = await redis.get(key);
      
      if (cachedData) {
        logger.info(`Cache hit for ${key}`);
        return res.json(JSON.parse(cachedData));
      }

      // Store original res.json function
      const originalJson = res.json;

      // Override res.json method
      res.json = function(data) {
        // Store the data in Redis before sending response
        redis.setex(key, duration, JSON.stringify(data))
          .catch(err => logger.error('Redis cache error:', err));

        // Call the original json method
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};

module.exports = { cache }; 