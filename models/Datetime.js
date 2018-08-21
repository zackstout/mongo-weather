
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DatetimeSchema = new Schema({
  dt: Number,
  // dt_txt: String, // sure this is redundant, but hey,
  predictions: [
    {
      type: Schema.Types.ObjectId,
      ref: "PredictedWeather"
    }
  ],
  real: {
    type: Schema.Types.ObjectId,
    ref: "RealWeather"
  }
});

module.exports = mongoose.model("Datetime", DatetimeSchema);
