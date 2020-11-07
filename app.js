var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  path = require('path'),
  User = require('./models/user'),
  Token = require('./models/token'),
  Insurance = require('./models/insurance'),
  crypto = require('crypto');
  mailer = require('nodemailer');
  bodyParser = require("body-parser");


mongoose.connect("mongodb://localhost:27017/User", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(function(){
  console.log("DB CONNECTED");
});

mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.get('', function(req, res){
  Insurance.find({}, function(err, all_insurances){
    if(err){
      return res.status(500).send({
        msg: err.message
      });
    }
    res.render('index', {'insurances': all_insurances});
  });
});

app.post('', function(req, res){
  var insurance_company = req.body.insurance;
  if(insurance_company){
    res.render('enter_details', {'insurance': insurance_company});
  }
  return res.status(500).send({
    msg: "Invalid"
  });
});

app.get('/users/add-insurance/admin/123456', function(req, res){
  res.render('add_insurance')
});

app.post('/users/add-insurance/admin/123456', function(req, res){
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

app.get('/users', function(req, res){
  res.render('enter_details');
});

app.post("/users", function(req, res) {
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
            user: "networkingkr016@gmail.com",
            pass: "Mohit@1504"
          }
        });
        var mailOptions = {
            from: 'networkingkr016@gmail.com',
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

app.post("/confirmation", function(req, res){
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

app.get("/added-users", function(req, res){
  User.find({}, function(err, Users) {
    if (err) {
      console.log(err);
    } else {
      res.send(Users)
    }
  });
})

const port = 8000

app.listen(port, function(){
  console.log(`App is up and running at port ${port}`);
});