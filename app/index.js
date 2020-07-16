const express = require('express');
const router = require('./routers/index.js');
const logger = require('../utils/logger.js')('app');
const httpError = require('../utils/http-error.js');

const app = express();

app.use('/api/v1/', router);

app.use((req, res, next) => {
  logger.info('error 404');
  next(httpError.notFound());
});

// error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (httpError.has(err) || httpError.isBadJson(err)) {
    logger.warn({ err, url: req.url });
    if (httpError.has(err)) {
      res.status(err.status).send(err.toJson());
    } else {
      const responseError = httpError.validate(err.message);
      res.status(err.status).send(responseError.toJson());
    }

    return;
  }

  logger.error({ err, url: req.url });
  const responseError = httpError.constructor(500, err.message);
  res.status(responseError.status).send(responseError.toJson());
});

module.exports = app;
