# Movie trailer extractor
The API takes a movie resource link (e.g. https://content.viaplay.se/pc-se/film/arrival-2016) as input and based on that returns the URL to the trailer for that movie.

### Example of query
`GET localhost:3000/api/v1/movie/trailer?link=http://content.viaplay.se/pc-se/film/fargo-1996&language=sv-SE`


`link` - requred query parameter

`language` - not required parameter for getting trailer on specific language (`en-En` by default)

### Example of responses
`400` - invalid input params or input url don't contains movie id

`404` - no info about trailer was found

`200` - `{ link: 'https://www.youtube.com/watch?v=h2tY82z3xXU' }`

## Installation

```bash
$ npm install
```

## Start
Before start the app you have to ensure, that all configuration options (like `TMDbApiKey`) are set in specific config

```bash
$ NODE_ENV=development node index.js
```

## Start tests
```bash
$ npm run test
```

## Start linter check
```bash
$ npm run lint
```

## Notes about future improvements
1. We could get info about different content type(tv shows and other). For this purpose we can create one base class and inherit others for each type
2. If it is nessesery, we could store link in our db and have task which updates this links 
3. We could get links to another video (trailers...) or another site (vimeo...)
4. There are a few trailer videos, but some of them have 'Teaser' word in title (in same time, it has 'Trailer' type). To avoid this Tmdb mistake, we could check title for this words.
5. We should run several instances for highloads