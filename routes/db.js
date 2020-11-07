var express = require("express"),
  db_router = express.Router(),
  User = require('../models/user');

db_router.get("/database", function(req, res){
  User.find({}, function(err, Users) {
    if (err) {
      console.log(err);
    } else {
      res.send(Users)
    }
  });
});

module.exports = db_router