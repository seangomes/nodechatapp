const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//MONGOOSE USER MODEL
var User = require('../models/user.js');

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/users', (req, res) => {
  let userList = [];
  User.find({}, function(err, users) {
    console.log("Online Brugere: ", users);
    users.forEach(user => {
      userList.push(user);
    });

    res.send(userList);
  });
});


//KICKED FUNCTION
router.post('/kicked', (req, res) => {
  if(req.body !== undefined){
    let userList = [];
    var user;
    User.findById(req.body.oid, function(err, user){
      user = req.body;
      console.log(req.body);
      User.remove({_id : req.body.oid}, function(err, msg) {
        console.log("User : " + JSON.stringify(user) + " is kicked and deleted from DB!".red);

        //updating userlist
        users.forEach(user => {
          userList.push(user);
        });

        res.json(user);
      });
    })
  }
});

//LOGIN SECTION
/* SAVE Username on login */
router.post('/login', (req, res) => {

  if(req.body !== undefined){
    //check if username exist
    User.find({ 'username': req.body.username }, function (err, docs) {
      if(docs.length === 0) {
        //Create the user in mongo db
        User.create(req.body, function (err, userInfo) {
          if (err) {
            return next(err);
          }
          let user = {
            "username": userInfo.username,
            "oid": userInfo._id,
            "admin": userInfo.admin
          };
          res.json(user);
        });
      }else{
        res.json("Brugernavnet er allerede taget. Find et andet!");
      }

    });
  }

});

/* DELETE Username on logout */
router.post('/logout', function(req, res, next) {
  User.remove({_id : req.body.oid}, function(err) {
    res.json("Brugeren er logget ud");
  })
});


module.exports = router;
