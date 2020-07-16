const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const supertest = require('supertest');
const app = require('../../app/index.js');
const redis = require('../../providers/redis');
const movieService = require('../../app/services/movie.service');

chai.should();
chai.use(chaiHttp);

const serverRequest = supertest(app);

describe('Test movie service', () => {
  const sandbox = sinon.createSandbox();

  afterEach(async () => {
    sandbox.restore();
  });

  describe('getTrailerLink', () => {
    it('should return 400 when query link invalid', async () => {
      const response = await serverRequest.get('/api/v1/movie/trailer').query({ link: 'example-com' });

      response.should.have.status(400);
    });

    it('should return cached link', async () => {
      sandbox.stub(redis, 'get').returns(Promise.resolve({ link: 'http://response-link.com' }));
      sandbox.stub(movieService, 'getTrailerLinkByMovieUrl').returns(Promise.resolve());
      const response = await serverRequest.get('/api/v1/movie/trailer').query({ link: 'http://example.com' });

      response.should.have.status(200);
      movieService.getTrailerLinkByMovieUrl.callCount.should.be.eql(0);
    });

    it('should return link', async () => {
      sandbox.stub(redis, 'get').returns(Promise.resolve(null));
      sandbox.stub(redis, 'set').returns(Promise.resolve(null));
      sandbox.stub(movieService, 'getTrailerLinkByMovieUrl').returns(Promise.resolve('http://response-link.com'));
      const response = await serverRequest.get('/api/v1/movie/trailer').query({ link: 'http://example.com' });

      response.should.have.status(200);
      response.body.should.be.eql({ link: 'http://response-link.com' });

      movieService.getTrailerLinkByMovieUrl.callCount.should.be.eql(1);
      redis.set.callCount.should.be.eql(1);
    });
  });
});
