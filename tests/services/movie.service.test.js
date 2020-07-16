const _ = require('lodash');
const chai = require('chai');
const sinon = require('sinon');
const movieDataExtractorService = require('../../app/services/movie-data-extractor.service');
const movieDbService = require('../../app/services/movie-db.service');
const movieService = require('../../app/services/movie.service');

chai.should();

describe('Test movie service', () => {
  const sandbox = sinon.createSandbox();

  afterEach(async () => {
    sandbox.restore();
  });

  describe('getTrailerLinkByMovieUrl', () => {
    it('should return 400 when no movie db id was found', async () => {
      sandbox.stub(movieDataExtractorService, 'getMovieInfoByUrl').returns(Promise.resolve({}));
      return movieService.getTrailerLinkByMovieUrl('http://example.com')
        .catch(async (err) => {
          err.status.should.be.eql(400);
          err.message.should.be.eql('Urls data does not contain movie id');
        });
    });

    it('should return 404 when no movie db trailer was found', async () => {
      const movieDbId = 'tt111';

      const movieData = _.set({}, '_embedded["viaplay:blocks"][0]._embedded["viaplay:product"].content.imdb.id', movieDbId);
      sandbox.stub(movieDataExtractorService, 'getMovieInfoByUrl').returns(Promise.resolve(movieData));
      sandbox.stub(movieDbService, 'getVideoInfo').returns(Promise.resolve([]));

      return movieService.getTrailerLinkByMovieUrl('http://example.com')
        .catch(async (err) => {
          err.status.should.be.eql(404);
          err.message.should.be.eql('Trailer not found');
        });
    });

    it('should return trailer link to youtube source', async () => {
      const movieDbId = 'tt111';
      const trailerInfo = {
        key: 'h2tY82z3xXU',
        type: 'Trailer',
      };

      const movieData = _.set({}, '_embedded["viaplay:blocks"][0]._embedded["viaplay:product"].content.imdb.id', movieDbId);
      sandbox.stub(movieDataExtractorService, 'getMovieInfoByUrl').returns(Promise.resolve(movieData));
      sandbox.stub(movieDbService, 'getVideoInfo').returns(Promise.resolve([trailerInfo]));

      const link = await movieService.getTrailerLinkByMovieUrl('http://example.com');
      link.should.be.eql('https://www.youtube.com/watch?v=h2tY82z3xXU');
    });
  });
});
