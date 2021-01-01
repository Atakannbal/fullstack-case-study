const Express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const redis = require("redis");

const app = Express();

const API_URL = `http://www.omdbapi.com/?apikey=c86f616f`;
const PAGES = [1, 2];
const PORT = 5000;
const REDIS_PORT = 6379;

const client = redis.createClient(REDIS_PORT);

// middleware - cors
app.use(cors());

// middleware - sets httpcache header
function httpCache(req, res, next) {
  res.set("Cache-control", `public, max-age=30`);
  next();
}

// middleware - checks redis cache
function redisCache(req, res, next) {
  const { keyword } = req.query;
  client.get(keyword, (err, data) => {
    if (err) throw err;
    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      next();
    }
  });
}

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// endpoint - search
app.get("/api/search", httpCache, redisCache, (req, res) => {
  const { keyword } = req.query;
  getMovies(keyword)
    .catch(() => {
      res.status(400).send({
        message: "No result",
      });
    })
    .then((movies) => {
      if (movies) {
        client.SET(keyword, JSON.stringify(movies));
        res.send(movies);
      }
    });
});

// endpoint - flush cache
app.get("/api/clear", (req, res) => {
  client.flushall();
  res.send("Refreshed cache");
});

// return an array of promises for the given page numbers
function getAllUrls(searchString) {
  return PAGES.map((pageNumber) =>
    fetch(`${API_URL}&s=${searchString}&page=${pageNumber}`)
  );
}

// aggregating the results of multiple promisses into movies array
async function getMovies(keyword) {
  const movies = [];
  const responses = await Promise.all(getAllUrls(keyword));
  try {
    const data = await Promise.all(responses.map((res) => res.json()));
    data.forEach((object) => movies.push(...object.Search));
  } catch (err) {
    throw Error("No match in database");
  }
  return movies;
}
