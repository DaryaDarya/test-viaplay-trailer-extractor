const _ = require('lodash');
const httpError = require('../../utils/http-error.js');
const movieDataExtractorService = require('./movie-data-extractor.service');
const movieDbService = require('./movie-db.service');
const VideoType = require('../helpers/enums/video-type.enum');
const linkComposer = require('../helpers/link-composer');

async function getTrailerLinkByMovieUrl(url, lang = 'en-En') {
  const movieInfo = await movieDataExtractorService.getMovieInfoByUrl(url);
  const movieDbId = _.get(movieInfo, '_embedded["viaplay:blocks"][0]._embedded["viaplay:product"].content.imdb.id');
  if (!movieDbId) {
    throw httpError.badRequest('Urls data does not contain movie id');
  }

  const videos = await movieDbService.getVideoInfo(movieDbId, lang);
  const trailer = _.first(_.filter(videos, { type: VideoType.Trailer }));
  if (!trailer || !trailer.key) {
    throw httpError.notFound('Trailer not found');
  }

  return linkComposer.composeTrailerLink(trailer.key);
}

module.exports = {
  getTrailerLinkByMovieUrl,
};
