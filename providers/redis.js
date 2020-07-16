const config = require('config');
const Redis = require('ioredis');
const logger = require('../utils/logger');

const redis = new Redis(config.get('redis'));

redis.on('error', (err) => {
  logger.error({ err });
});

async function get(key) {
  try {
    const value = await redis.get(key);
    return JSON.parse(value);
  } catch (err) {
    logger.error({ err });
    return null;
  }
}

function set(key, value, expireSeconds) {
  return redis.set(key, JSON.stringify(value), 'EX', expireSeconds);
}

module.exports = {
  get,
  set,
};
