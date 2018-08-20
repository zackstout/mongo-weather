
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../models');
var axios = require('axios');

const api_proj = '4bcb3c76028e1c9c';
const api_key = '24203607faa5b9ea5f063794f983e08d';
const today = '0817';

router.get('/history', function(req, res) {
  axios.get(`http://api.wunderground.com/api/${api_proj}/history_2018${today}/q/MN/Minneapolis.json`)
    .then(function(data) {
      // console.log(data.data.history);
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
      res.json(data.data.list);
    })
    .catch(function(err) {
      // console.log(err);
      res.json(err);
    });
});


module.exports = router;
