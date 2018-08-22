const router = require("express").Router();
// const articlesController = require("../../controllers/articlesController");

var dotenv = require('dotenv').config();
const api_proj = process.env.API_PROJ;
const moment = require('moment');
const axios = require('axios');

router.get('/', function(req, res) {
  const today = moment().format("YYYYMMDD");

    axios.get(`http://api.wunderground.com/api/${api_proj}/history_${today}/q/MN/Minneapolis.json`)
    .then(function(data) {
      const hist = data.data.history;
      // const weather = hist.observations[hist.observations.length - 1];
      // let hour = parseInt(weather.date.hour);
      // // Have to get next relevant time, e.g. for 2:53 PM we want 3 PM, for 3:53 PM we want 6 PM:
      // for (i=1; i < 4; i++) {
      //   hour += 1;
      //   // We only care about multiples of 3:
      //   if (hour % 3 == 0) {
      //     break;
      //   }
      // }
      //
      // const mom_date = moment(`${weather.date.year}${weather.date.mon}${weather.date.mday}T${hour}00`);
      // console.log(mom_date.format("X"));
      //
      // const nearest_time = mom_date.format("X");

      res.json(hist);
    })
    .catch(function(err) {
      console.log(err);
      res.json(err);
    });
});

module.exports = router;
