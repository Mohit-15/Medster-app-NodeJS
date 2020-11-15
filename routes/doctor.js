require('dotenv').config()
var express = require("express"),
  mongoose = require("mongoose"),
  doctor_router = express.Router(),
  Doctor = require('../models/doctor');

doctor_router.get('/users/add-doctor/admin/123456', function(req, res){
  res.render('add_doctor')
});

doctor_router.post('/users/add-doctor/admin/123456', function(req, res){
  var newDoctor = new Doctor(req.body);
  newDoctor.save(function(err){
    if(err){
      return res.status(500).send({
        msg: err.message
      });
    }
    res.redirect('/users/add-doctor/admin/123456');
  });
});

module.exports = doctor_router