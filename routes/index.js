var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var journeyModel=require('../models/journeys');
var userModel=require('../models/users');

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]

const fullDateFormat = function(date){
  var newDate = new Date(date);
  var format = newDate.getDate()+'/'+(newDate.getMonth()+1)+'/'+newDate.getFullYear();
  return format;
}

const formattedDepartureTime= function(time){
  var formattedDepartureTime='';
  if(parseInt(time.substring(0,2))>12)
        {
          formattedDepartureTime= time + ' pm'
        }
        else
        {
          formattedDepartureTime= time+ ' am'
        }
  return formattedDepartureTime
}


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
  if(search.length==0){
    res.redirect('/no-train')
  }
  res.render('homepage',{search});
});
//SI PAS DE TRAIN
router.get("/no-train",async function(req,res,next){
  res.render("no-train");
})

router.get('/shop', async function(req, res, next) {
  if(!req.session.ticketList)
  {
      req.session.ticketList=[]
  }
 
    if(req.query.id)
    {
      if(!req.session.ticketList.find(element=> element.id===req.query.id))
      {
          var journey=await journeyModel.findById(req.query.id)
         
          req.session.ticketList.push({
              id: req.query.id,
              journey: `${journey.departure}/${journey.arrival}`,
              date: fullDateFormat(journey.date),
              departureTime: formattedDepartureTime(journey.departureTime),
              price: journey.price
            })
      } 
   } 
 
   console.log(req.session.ticketList)
res.render('shop', {ticketList:req.session.ticketList});
});




module.exports = router;
