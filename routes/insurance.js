require('dotenv').config()
var express = require("express"),
  mongoose = require("mongoose"),
  registration_router = express.Router(),
  path = require('path'),
  User = require('../models/user'),
  Token = require('../models/token'),
  Insurance = require('../models/insurance'),
  crypto = require('crypto'),
  mailer = require('nodemailer'),
  bodyParser = require("body-parser");

registration_router.get('/users/add-insurance/admin/123456', function(req, res){
  res.render('add_insurance')
});

registration_router.post('/users/add-insurance/admin/123456', function(req, res){
  var newInsurance = new Insurance(req.body);
  newInsurance.save(function(err){
    if(err){
      return res.status(500).send({
        msg: err.message
      });
    }
    res.redirect('/users/add-insurance/admin/123456');
  });
});

module.exports = registration_router