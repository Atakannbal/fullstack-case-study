const Express = require('express');
const fetch = require('node-fetch');
const cors = require('cors'); 

var app = Express();

const API_URL = `http://www.omdbapi.com/?apikey=c86f616f`
const PAGES = [1,2];
const PORT = 5000;

let cache = {};

//cors middleware
app.use(cors());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

//search endpoint
app.get('/api/search', setCache, (req, res) => {
  const queryParam = req.query;

  // checks in memory cache if given keyword exists as a property
  // if it exists, send response from cache
  // if not, fetch external api and populate cache 
  if(cache.hasOwnProperty(queryParam.keyword)){
    res.send(cache[queryParam.keyword]);  
    }
  else{
    getMovies(queryParam.keyword)
      .catch((err) => {
        res.status(400).send({
          message: 'No result'
        });  
      })
      .then((movies) => {
      cache[queryParam.keyword] = movies;
      res.send(movies);
      });
    }
})

//endpoint to flush cache
app.get('/api/clear', (req,res) => {
  cache = {};
  res.send('Refreshed cache');
})

//aggregating the results of multiple promisses into movies array
async function getMovies(keyword) {
  let movies = [];
    const responses = await Promise.all(getAllUrls(keyword));
  try {
    const data = await Promise.all(responses.map(res => res.json()));
    data.forEach(object => movies.push(...object.Search));
  } catch(err){
    throw Error('No match in database')
  }
  return movies;
}

//return an array of promises for the given page numbers
function getAllUrls(searchString){
   return PAGES.map((pageNumber) => 
    fetch(`${API_URL}&s=${searchString}&page=${pageNumber}`)
  )
}

//http cache middleware function 
function setCache(req, res, next){
  res.set('Cache-control', `public, max-age=30`)
  next();
}