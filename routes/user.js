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
  res.render('enter_details');
});

router.post("/users", function(req, res) {
  var user_email = req.body.email;
  console.log(req.body);
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
        token: crypto.randomBytes(16).toString('hex')
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
            user: "xxxxxxxxxxxxx@gmail.com",
            pass: "xxxxxxxxxxxxxx"
          }
        });
        var mailOptions = {
            from: 'xxxxxxxxxxxxx@gmail.com',
            to: req.body.email,
            subject: 'Email Verification',
            text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' 
          };
        transporter.sendMail(mailOptions, function (err) {
                if (err){ 
                  return res.status(500).send({ 
                    msg: err.message 
                  });
                }
                res.status(200).send('Verification email has been sent to ' + user.email + '.');
            });
       });
    });
  });
});

router.post("/confirmation", function(req, res){
  var verification_token = req.params.token;
  Token.findOne({ token: req.body.token }, function (err, token){
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
                res.status(200).send("The account has been verified. Please log in.");
            });
        });
      });
});

module.exports = router
