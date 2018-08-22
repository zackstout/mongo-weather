// const path = require("path");
const router = require("express").Router();
// const predictionRouter = require("./PredictedWeatherRouter.js");
const routes = require('./api-routes');

router.use("/api", routes);

module.exports = router;
