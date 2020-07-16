const http = require('http');
const config = require('config');
const logger = require('./utils/logger.js')('entry-point');
const app = require('./app/index.js');

const server = http.createServer(app);
server.listen(config.server.port, config.server.host, () => {
  const { port, address } = server.address();

  logger.info('App(%s) listening at %s:%s', config.env, address, port);
});
