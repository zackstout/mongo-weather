
const db = require("../models");
var axios = require('axios');
var dotenv = require('dotenv').config();
var moment = require('moment');


// Should only need to create -- and eventually will want more, to compare with predictions, etc.
module.exports = {
  addRealWeather(weather, dt) {
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
      console.log('real weather is ', real_weather);
      return db.Datetime.findOneAndUpdate({ dt: dt }, { $push: { real: real_weather._id } }, { new: true });

    })
    .catch(function(err) {
      console.log(err);
    });
  },

  addDailySummary(weather, dt) {
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
      console.log('real weather is ', real_weather);
      return db.Datetime.findOneAndUpdate({ dt: dt }, { $push: { real: real_weather._id } }, { new: true });

    })
    .catch(function(err) {
      console.log(err);
    });
  }

};
