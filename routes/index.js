var express = require('express');
const session = require('express-session');
var router = express.Router();
const mongoose = require('mongoose');

var journeyModel=require('../models/journeys');
var userModel=require('../models/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});


// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       
       await newUser.save();

    }

  }
  res.render('index', { title: 'Express' });
});


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result', function(req, res, next) {

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, journey) {

          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )

  }


  res.render('index', { title: 'Express' });
});
//PAGE HOMEPAGE
router.get('/homepage',async function(req,res,next){
  var journeys=await journeyModel.find();
  res.render('homepage');
});
//RECHERCHE DE BILLET
router.post('/search',async function(req,res,next){
  var search=await journeyModel.find({departure:req.body.departure,arrival:req.body.arrival,date:req.body.date});
  req.session.date=req.body.date;
  req.session.result=[];
  for(let i=0;i<search.length;i++){
    req.session.result.push({id:search[i]._id,departure:search[i].departure,
    arrival:search[i].arrival,date:search[i].date,departureTime:search[i].departureTime,price:search[i].price});
  }
  res.redirect('train');
});
//SI PAS DE TRAIN
router.get("/train",async function(req,res,next){
  var train=req.session.result;
  res.render("train",{train,date:req.session.date});
})
module.exports = router;
