const Joi = require('@hapi/joi');
const movieService = require('../services/movie.service');
const httpError = require('../../utils/http-error.js');
const redis = require('../../providers/redis.js');

const schema = Joi.object({
  url: Joi
    .string()
    .trim()
    .uri()
    .required(),
  lang: Joi.string()
    .pattern(/([a-z]{2}-[A-Z]{2})|([a-z]{2}|[A-Z]{2})/),
});

async function getTrailerLink(url, lang) {
  const { error, value } = schema.validate({ url, lang });
  if (error) {
    throw httpError.badRequest(error.message, error);
  }

  const redisKey = `trailer:${value.url}:${value.lang}`;
  const cached = await redis.get(redisKey);
  if (cached) {
    return cached;
  }

  const link = await movieService.getTrailerLinkByMovieUrl(value.url, value.lang);
  if (link) {
    await redis.set(redisKey, { link }, 360);
  }

  return { link };
}

module.exports = {
  getTrailerLink,
};
