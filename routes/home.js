var express = require("express"),
  mongoose = require("mongoose"),
  home_router = express.Router(),
  Insurance = require('../models/insurance'),
  bodyParser = require("body-parser");

home_router.get('', function(req, res){
  res.render('main')
});

home_router.get('/index', function(req, res){
  Insurance.find({}, function(err, all_insurances){
    if(err){
      return res.status(500).send({
        msg: err.message
      });
    }
    res.render('index', {'insurances': all_insurances});
  });
});

/*home_router.post('', function(req, res){
  var insurance_company = req.body;
  if(insurance_company){
    res.render('enter_details', {'insurance': insurance_company});
  }
  return res.status(500).send({
    msg: "Invalid"
  });
});*/

module.exports = home_router
