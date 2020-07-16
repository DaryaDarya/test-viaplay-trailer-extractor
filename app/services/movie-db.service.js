const config = require('config');
const { MovieDb } = require('moviedb-promise');
const logger = require('../../utils/logger.js')('movie-db');

const moviedb = new MovieDb(config.TMDbApiKey);

async function getVideoInfo(id, lang) {
  try {
    const videos = await moviedb.movieVideos({ id, language: lang });
    return videos.results;
  } catch (err) {
    logger.err({ err, id }, 'Can not get video info');
    return [];
  }
}

module.exports = {
  getVideoInfo,
};
