// const path = require("path");
const router = require("express").Router();
const predictionRouter = require("./PredictedWeatherRouter.js");
const realRouter = require("./RealWeatherRouter.js");

router.use("/forecast", predictionRouter);
router.use("/history", realRouter);

module.exports = router;
