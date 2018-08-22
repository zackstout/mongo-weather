
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PredictedWeatherSchema = new Schema({
  dt: {
    type: Schema.Types.ObjectId,
    ref: 'Datetime'
  },
  // These are important:
  predictionMade: Number,
  // predictionMade_txt: String,

  rain: Number, // not sure what this measures
  weather_main: String,
  weather_desc: String,
  wind_speed: Number,
  wind_deg: Number,
  humidity: Number,
  pressure: Number,
  temp: Number
});

module.exports = mongoose.model("SummaryWeather", SummaryWeatherSchema);
