require('dotenv').config()
var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  router = express.Router(),
  path = require('path'),
  bodyParser = require("body-parser");

mongoose.connect(process.env.HOST, {
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

const registrationRouter = require('./routes/insurance');
const databaseRouter = require('./routes/db');
const homeRouter = require("./routes/home");
const userRouter = require("./routes/user");
app.use('', registrationRouter);
app.use('', databaseRouter);
app.use('', homeRouter);
app.use('', userRouter);

const port = 8000

app.listen(port, function(){
  console.log(`App is up and running at port ${port}`);
});