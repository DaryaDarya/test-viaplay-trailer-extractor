const config = require('config');
const bunyan = require('bunyan');

const logger = bunyan.createLogger({ name: 'trailerExtractor', level: config.logger.level });

module.exports = function createLogger(service) {
  return logger.child({ service });
};
