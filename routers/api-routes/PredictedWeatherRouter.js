const router = require("express").Router();
// const articlesController = require("../../controllers/articlesController");

const getCurrent = require('../../modules/weatherapi.js').getCurrentWeather;
// const getForecast = require('../../modules/weatherapi.js').getForecast;

// const api_proj = process.env.API_PROJ;

// I doubt we need this more than once:
var dotenv = require('dotenv').config();
const api_key = process.env.API_KEY;

const axios = require('axios');

router.get('/', function(req, res) {
  axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=Minneapolis&APPID=${api_key}`)
  .then(function(data) {
    // console.log(data.data.list);
    const list = data.data.list;

    getCurrent();

    // We get 40 predictions: 8/day for next 5 days.
    res.json(list);
  })
  .catch(function(err) {
    // console.log(err);
    res.json(err);
  });
});


module.exports = router;
