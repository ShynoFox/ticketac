var express = require('express');
var router = express.Router();
// var request = require('sync-request');

var userModel = require('../models/users')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/sign-up', async function(req,res,next){
  var searchUser = await userModel.findOne({
    email: req.body.emailFromFront
  })
  
  if(!searchUser){
    var newUser = new userModel({
      name: req.body.nameFromFront,
      firstname: req.body.firstNameFromFront,
      email: req.body.emailFromFront,
      password: req.body.passwordFromFront,
      journeys:[]
    })
  
    var newUserSave = await newUser.save();
  
    req.session.user = {
      email : newUserSave.email,
      id: newUserSave._id,
    }
    console.log(req.session.user)
    res.redirect('/homepage')
  } else {
    res.redirect('/')
  }
  
});

router.post('/sign-in', async function(req,res,next){

  var searchUser = await userModel.findOne({
    email: req.body.emailFromFront,
    password: req.body.passwordFromFront
  })

  if(searchUser!= null){
    req.session.user = {
      email: searchUser.email,
      id: searchUser._id
    }
    console.log(req.session.user)
    res.redirect('/homepage')
  } else {
    res.render('login')
  }

  
});

router.get('/logout', function(req,res,next){

  req.session.user = null;

  res.redirect('/')
});

module.exports = router;
