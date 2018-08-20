
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var WeatherSchema = new Schema({
  text: String,
  speaker: String,
  line_no: String,
  play: {
    type: Schema.Types.ObjectId,
    ref: 'Play'
  }
});

module.exports = mongoose.model("Weather", WeatherSchema);
