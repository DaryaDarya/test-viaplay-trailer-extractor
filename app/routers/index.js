const express = require('express');
const movieController = require('../controllers/movie.controller.js');

const router = express.Router();

router.get('/movie/trailer', async (req, res, next) => {
  try {
    const link = await movieController.getTrailerLink(req.query.link, req.query.language);
    res.status(200).send(link);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
