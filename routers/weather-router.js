
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../models');
var axios = require('axios');
var dotenv = require('dotenv').config();
var moment = require('moment');

const api_proj = process.env.API_PROJ;
const api_key = process.env.API_KEY;
const today = '0820';


function getCurrentWeather() {
  const date = new Date();
  console.log(date);
  axios.get(`http://api.wunderground.com/api/${api_proj}/history_2018${today}/q/MN/Minneapolis.json`)
  .then(function(data) {
    // console.log(data.data.history);
    const hist = data.data.history;
    // console.log('last history is ', hist.observations[hist.observations.length - 1]);

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

    // const date = new Date(parseInt(weather.date.year), parseInt(weather.date.mon) - 1, parseInt(weather.date.mday), hour, 0, 0); // August is 07.
    // console.log(date);
    // const month = weather;
    const mom_date = moment(`${weather.date.year}${weather.date.mon}${weather.date.mday}T${hour}00`);
    console.log(mom_date.format("X"));

    const { tempi, dewpti, hum, wspdi, wdird, conds, rain, pressurei } = weather;

    DatetimeController.create(mom_date, mom_date.format("X"));
    console.log(tempi, dewpti);


    // The last of the Observations array should be most up-to-date:
    res.json(hist);
  })
  .catch(function(err) {
    res.json(err);
  });
}

// Target is the Datetime document to which we're adding this prediction (i.e. when it's a prediction for):
function addPrediction(pred, target) {
  db.PredictedWeather.create({
    predictionMade: pred.dt, // this is wrong!!!
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
    return db.Datetime.findOneAndUpdate({ dt: target.dt }, { $push: { predictions: prediction._id } }, { new: true });
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

    getCurrentWeather();

    // list.forEach(pred => {
    //   // console.log(pred.dt);
    //
    //   db.Datetime.find({ dt: pred.dt })
    //   .then(result => {
    //     // Check whether we found a match:
    //     if (!result[0]) {
    //       // console.log('empty');
    //       db.Datetime.create({
    //         dt: pred.dt
    //       })
    //       .then(function(created_dt) {
    //         // console.log(res2);
    //
    //         // Should def be split out into a function, used again below:
    //         // Create a prediction:
    //         addPrediction(pred, created_dt);
    //       })
    //       .catch(function(err) {
    //         console.log(err);
    //       });
    //
    //
    //     } else {
    //       console.log(result[0]);
    //       // Update existing datetime with a prediction:
    //       addPrediction(pred, result[0]);
    //
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
    //
    // }); // end forEach

    // We get 40 predictions: 8/day for next 5 days.
    res.json(list);
  })
  .catch(function(err) {
    // console.log(err);
    res.json(err);
  });
});


module.exports = router;
