require('dotenv').config()
var express = require("express"),
  mongoose = require("mongoose"),
  doctor_router = express.Router(),
  Doctor = require('../models/doctor'),
  Token = require('../models/doc_token'),
  Doctor = require('../models/doctor'),
  crypto = require('crypto'),
  mailer = require('nodemailer'),
  bodyParser = require("body-parser");

doctor_router.get('/users/add-doctor/admin/123456', function(req, res){
  res.render('doctor_registration')
});

doctor_router.post('/users/add-doctor/admin/123456', function(req, res){
  var doctor_email = req.body.email;
  Doctor.findOne({ email: doctor_email }, function(err, doctor){
    if(doctor) {
      return res.status(400).send({
        msg: "Email Already Exist!!"
      });
    }
    doc = new Doctor(req.body);
    doc.save(function(err){
      if(err){
        return res.status(500).send({
          msg: err.message
        });
      }
      var token = new Token({
        _userId: doc._id,
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

doctor_router.get("/users/verification/otp", function(req, res){
  res.render('otp')
})

doctor_router.post("/users/verification/otp", function(req, res){
  Token.findOne({ token: req.body.otp }, function (err, token){
        if (!token){ 
          return res.status(400).send({ 
            type: 'not-verified', 
            msg: 'Token may have expired!!' });
        }

        Doctor.findOne({ _id: token._userId }, function(err, doctor){
            if (!doctor){
              return res.status(400).send({
               msg: 'We were unable to find a user for this token.' 
             });
            }

            if (doctor.isVerified){
              return res.status(400).send({ 
                type: 'already-verified',
                msg: 'This doctor has already been verified.' 
              });
            }
            
            doctor.isVerified = true;
            doctor.save(function (err){
                if (err) { 
                  return res.status(500).send({
                   msg: err.message 
                 }); 
                }
                res.redirect("/users/add-doctor/thankyou");
            });
        });
      });
});

doctor_router.get("/users/add-doctor/thankyou", function(req, res){
  res.render("Thankyou")
})

module.exports = doctor_router
