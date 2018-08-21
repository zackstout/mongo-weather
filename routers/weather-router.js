
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../models');
var axios = require('axios');
var dotenv = require('dotenv').config();
var moment = require('moment');

const api_proj = process.env.API_PROJ;
const api_key = process.env.API_KEY;
// const today = '0820';
var schedule = require('node-schedule');

// This means run every minute (whenever minute is divisible by 1):
var j = schedule.scheduleJob('*/1 * * * *', function(){
  console.log('The answer to life, the universe, and everything!');
});

// Note, we should also work in the daily summary property of History somehow

getCurrentWeather();


function getCurrentWeather() {
  // Ew, using Date we were 5 hours ahead..
  console.log(moment().format("YYYYMMDD"));
  const today = moment().format("YYYYMMDD");

  axios.get(`http://api.wunderground.com/api/${api_proj}/history_${today}/q/MN/Minneapolis.json`)
  .then(function(data) {
    const hist = data.data.history;
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

    const mom_date = moment(`${weather.date.year}${weather.date.mon}${weather.date.mday}T${hour}00`);
    console.log(mom_date.format("X"));

    // Think this is unnecessary, we're just passing along whole object:
    const { tempm, dewptm, hum, wspdm, wdird, conds, rain, pressurem } = weather;

    const nearest_time = mom_date.format("X");

    db.Datetime.find({ dt: nearest_time })
    .then(function(datetime) {
      // will still need error handling here, even though in theory this dt should always exist (and have existed for 5 days)
      addRealWeather(weather, nearest_time);
    })
    .catch(function(err) {
      console.log(err);
    });

    // Should probably pass in current time:
    // getForecast(mom_date.format("X"));

    // The last of the Observations array should be most up-to-date:
    // res.json(hist);
  })
  .catch(function(err) {
    console.log(err);
    // res.json(err);
  });
}


function addRealWeather(weather, dt) {
  db.RealWeather.create({
    rain: parseInt(weather.rain),
    humidity: weather.hum,
    pressure: weather.pressurem,
    temp: weather.tempm,
    weather_desc: weather.conds,
    wind_speed: weather.wspdm,
    wind_deg: weather.wdird
  })
  .then(function(real_weather) {
    return db.Datetime.findOneAndUpdate({ dt: dt }, { $push: { real: real_weather._id } }, { new: true });
  })
  .catch(function(err) {
    console.log(err);
  });
}


// pred.dt is the Datetime document to which we're adding this prediction (i.e. when it's a prediction for):
function addPrediction(pred, timestamp) {
  db.PredictedWeather.create({
    predictionMade: timestamp,
    rain: pred.rain ? pred.rain['3h'] : 0,
    humidity: pred.main.humidity,
    pressure: pred.main.pressure,
    temp: pred.main.temp,
    weather_main: pred.weather[0].main,
    weather_desc: pred.weather[0].description,
    wind_speed: pred.wind.speed,
    wind_deg: pred.wind.deg
  })
  .then(function(prediction) {
    return db.Datetime.findOneAndUpdate({ dt: pred.dt }, { $push: { predictions: prediction._id } }, { new: true });
  })
  .catch(function(err) {
    console.log(err);
  });
}


function getForecast(timestamp) {
  axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=Minneapolis&APPID=${api_key}`)
  .then(function(data) {
    // console.log(data.data.list);
    const list = data.data.list;

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
            addPrediction(pred, timestamp);
          })
          .catch(function(err) {
            console.log(err);
          });

        } else {
          // console.log(result[0]);
          // Update existing datetime with a prediction:
          addPrediction(pred, timestamp);
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


router.get('/forecast', function(req, res) {
  axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=Minneapolis&APPID=${api_key}`)
  .then(function(data) {
    // console.log(data.data.list);
    const list = data.data.list;

    // We get 40 predictions: 8/day for next 5 days.
    res.json(list);
  })
  .catch(function(err) {
    // console.log(err);
    res.json(err);
  });
});


module.exports = router;
