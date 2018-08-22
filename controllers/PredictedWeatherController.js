
const db = require("../models");
var axios = require('axios');
var dotenv = require('dotenv').config();
var moment = require('moment');

// Need to create -- and eventually will want to find all with given predictionMaking date, or predictionFor date
module.exports = {
  addPrediction(pred, timestamp) {
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
      // console.log('predicted weather is ', prediction);
      return db.Datetime.findOneAndUpdate({ dt: pred.dt }, { $push: { predictions: prediction._id } }, { new: true });
    })
    .catch(function(err) {
      console.log(err);
    });
  }

};
