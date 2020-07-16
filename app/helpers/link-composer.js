const httpError = require('../../utils/http-error.js');

function composeTrailerLink(id, site = 'YouTube') {
  switch (site) {
    case 'YouTube':
      return `https://www.youtube.com/watch?v=${id}`;
    default:
      throw httpError.notFound('Unknown trailer site');
  }
}

module.exports = {
  composeTrailerLink,
};
