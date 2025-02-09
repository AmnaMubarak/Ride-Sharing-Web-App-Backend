const redis = require('../lib/redis');
const logger = require('./logger');

const clearUserCache = async (userId) => {
  try {
    const keys = await redis.keys(`cache:*${userId}*`);
    if (keys.length) {
      await redis.del(keys);
      logger.info(`Cleared cache for user ${userId}`);
    }
  } catch (error) {
    logger.error('Cache clearing error:', error);
  }
};

const clearAllCache = async () => {
  try {
    await redis.flushall();
    logger.info('Cleared all cache');
  } catch (error) {
    logger.error('Cache clearing error:', error);
  }
};

module.exports = {
  clearUserCache,
  clearAllCache
}; 