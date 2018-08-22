
const predController = require('../controllers/PredictedWeatherController.js');
const realController = require('../controllers/RealWeatherController.js');

var db = require('../models');
var axios = require('axios');
var dotenv = require('dotenv').config();
var moment = require('moment');

// NOTE: must source these *after* dotenv -- and i think we don't want quotes in .env:
const api_proj = process.env.API_PROJ;
const api_key = process.env.API_KEY;

function getForecast(timestamp) {
  axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=Minneapolis&APPID=${api_key}`)
  .then(function(data) {
    // console.log(data.data.list);
    const list = data.data.list;

    // This stuff should be outsourced to Datetime controller (which talks to DB):
    list.forEach(pred => {
      db.Datetime.find({ dt: pred.dt })
      .then(result => {

        // Check whether we found a match:
        if (!result[0]) {
          // console.log('empty');
          db.Datetime.create({
            dt: pred.dt
          })
          .then(function(created_dt) {
            // Create a prediction:
            predController.addPrediction(pred, timestamp);
          })
          .catch(function(err) {
            console.log(err);
          });

        } else {
          // console.log(result[0]);
          // Update existing datetime with a prediction:
          predController.addPrediction(pred, timestamp);
        }
      })
      .catch(err => {
        console.log(err);
      });

    }); // end forEach
  })
  .catch(function(err) {
    console.log(err);
  });
}


function getCurrentWeather() {
  // Ew, using Date we were 5 hours ahead..
  console.log('we are getting current weather...', moment().format("YYYYMMDD"));
  const today = moment().format("YYYYMMDD");
  console.log('api proj is...', api_proj, 'today is...', today);
  axios.get(`http://api.wunderground.com/api/${api_proj}/history_${today}/q/MN/Minneapolis.json`)
  .then(function(data) {
    const hist = data.data.history;
    if (!hist) return;

    const weather = hist.observations[hist.observations.length - 1];
    let hour = parseInt(weather.date.hour);
    // Have to get next relevant time, e.g. for 2:53 PM we want 3 PM, for 3:53 PM we want 6 PM:
    for (i=1; i < 4; i++) {
      hour += 1;
      // We only care about multiples of 3:
      if (hour % 3 == 0) {
        break;
      }
    }

    // if (process.env.MONGO_URI) {}

    const mom_date = moment(`${weather.date.year}${weather.date.mon}${weather.date.mday}T${hour}00`);
    console.log('mom_date is...', mom_date.format("X"));

    // Think this is unnecessary, we're just passing along whole object:
    const { tempm, dewptm, hum, wspdm, wdird, conds, rain, pressurem } = weather;

    const nearest_time = mom_date.format("X");

    db.Datetime.find({ dt: nearest_time })
    .then(function(datetime) {
      console.log("found datetime is ", datetime);
      // will still need error handling here, even though in theory this dt should always exist (and have existed for 5 days)
      realController.addRealWeather(weather, nearest_time);
    })
    .catch(function(err) {
      console.log(err);
    });

    // Should probably pass in current time:
    getForecast(mom_date.format("X"));

    // The last of the Observations array should be most up-to-date:
    // res.json(hist);
  })
  .catch(function(err) {
    console.log(err);
    // res.json(err);
  });
}

module.exports = {
  getCurrentWeather: getCurrentWeather,
  getForecast: getForecast
};
