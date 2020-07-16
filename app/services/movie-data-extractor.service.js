const rp = require('request-promise');
const logger = require('../../utils/logger.js')('movie-data-extractor');

async function getMovieInfoByUrl(uri) {
  const options = {
    uri,
    json: true,
  };
  try {
    const response = await rp(options);
    logger.debug({ response, uri }, 'Movie info received');
    return response;
  } catch (err) {
    logger.err({ err, uri }, 'Can not get movie info');
    return {};
  }
}

module.exports = {
  getMovieInfoByUrl,
};
