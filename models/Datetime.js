
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DatetimeSchema = new Schema({
  dt: Number,
  dt_txt: String, // sure this is redundant, but hey
});

module.exports = mongoose.model("Datetime", DatetimeSchema);
