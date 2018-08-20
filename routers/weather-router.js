
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
// var db = require('../models');
var axios = require('axios');
var dotenv = require('dotenv').config();


const api_proj = process.env.API_PROJ;
const api_key = process.env.API_KEY;
const today = '0820';

router.get('/history', function(req, res) {
  axios.get(`http://api.wunderground.com/api/${api_proj}/history_2018${today}/q/MN/Minneapolis.json`)
    .then(function(data) {
      console.log(data.data.history);
      // The last of the Observations array should be most up-to-date:
      res.json(data.data.history);
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get('/forecast', function(req, res) {
  axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=Minneapolis&APPID=${api_key}`)
    .then(function(data) {
      console.log(data.data.list);
      // We get 40 predictions: 8/day for next 5 days.
      res.json(data.data.list);
    })
    .catch(function(err) {
      // console.log(err);
      res.json(err);
    });
});


module.exports = router;
