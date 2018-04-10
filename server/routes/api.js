const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//MONGOOSE USER MODEL
var User = require('../models/user.js')

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/messages', (req, res) => {
  // Get posts from the mock api
  let messages = [
    {name: "Jens", message: "Hej allesammen"},
    {name: "Glenn", message: "Hej med dig Jens!"},
    {name: "Peter", message: "Hvordan går det?"}
  ];
  //console.log(messages);
  res.send(messages);

});

router.get('/users', (req, res) => {
  
  User.find({}, function(err, users) {
    console.log("Online Brugere: ", users);
    res.send(users);
  });
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
          let user = {"username": userInfo.username, "oid": userInfo._id};
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