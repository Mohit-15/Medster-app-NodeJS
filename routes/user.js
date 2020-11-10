require('dotenv').config()
var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  router = express.Router(),
  path = require('path'),
  User = require('../models/user'),
  Token = require('../models/token'),
  Insurance = require('../models/insurance'),
  crypto = require('crypto'),
  mailer = require('nodemailer'),
  bodyParser = require("body-parser");


router.get('/users', function(req, res){
  Insurance.find({}, function(err, all_insurances){
    if(err){
      return res.status(500).send({
        msg: err.message
      });
    }
    res.render('enter_details', {'insurances': all_insurances});
  });
});

router.post("/users", function(req, res) {
  var user_email = req.body.email;
  User.findOne({ email: user_email }, function(err, user){
    if(user) {
      return res.status(400).send({
        msg: "Email Already Exist!!"
      });
    }
    user = new User(req.body);
    user.save(function(err){
      if(err){
        return res.status(500).send({
          msg: err.message
        });
      }
      var token = new Token({
        _userId: user._id,
        token: Math.floor(1000 + Math.random() * 9000)
      });
      token.save(function(err){
        if (err) { 
          return res.status(500).send({ 
            msg: err.message 
          }); 
        }
        var transporter = mailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_HOST,
            pass: process.env.EMAIL_PASS
          }
        });
        var mailOptions = {
            from: process.env.EMAIL_HOST,
            to: req.body.email,
            subject: 'Email Verification',
            text: 'Hello,\n\n' + 'Use this code to verify your account: ' + token.token + '.\n' 
          };
        transporter.sendMail(mailOptions, function (err) {
                if (err){ 
                  return res.status(500).send({ 
                    msg: err.message 
                  });
                }
                res.redirect('/users/verification/otp')
            });
       });
    });
  });
});

router.get("/users/verification/otp", function(req, res){
  res.render('otp')
})

router.post("/users/verification/otp", function(req, res){
  Token.findOne({ token: req.body.otp }, function (err, token){
        if (!token){ 
          return res.status(400).send({ 
            type: 'not-verified', 
            msg: 'Token may have expired!!' });
        }

        User.findOne({ _id: token._userId }, function(err, user){
            if (!user){
              return res.status(400).send({
               msg: 'We were unable to find a user for this token.' 
             });
            }

            if (user.isVerified){
              return res.status(400).send({ 
                type: 'already-verified',
                msg: 'This user has already been verified.' 
              });
            }
            
            user.isVerified = true;
            user.save(function (err){
                if (err) { 
                  return res.status(500).send({
                   msg: err.message 
                 }); 
                }
                res.redirect("/");
            });
        });
      });
});

module.exports = router