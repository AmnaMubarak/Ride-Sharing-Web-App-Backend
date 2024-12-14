const { Client } = require('pg');
const logger = require('./logger');

const waitForDatabase = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  let retries = 5;
  while (retries) {
    try {
      await client.connect();
      await client.query('SELECT 1');
      await client.end();
      logger.info('Database is ready!');
      return;
    } catch (err) {
      retries -= 1;
      logger.warn(`Database not ready. ${retries} retries left...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  logger.error('Failed to connect to database');
  process.exit(1);
};

module.exports = waitForDatabase; 