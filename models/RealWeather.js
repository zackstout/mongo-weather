
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var RealWeatherSchema = new Schema({
  dt: {
    type: Schema.Types.ObjectId,
    ref: 'Datetime'
  },
  rain: Number, // not sure what this measures
  weather_main: String,
  weather_desc: String,
  wind_speed: Number,
  wind_deg: Number,
  humidity: Number,
  pressure: Number,
  temp: Number
});

module.exports = mongoose.model("RealWeather", RealWeatherSchema);
