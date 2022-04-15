var mongoose = require('mongoose')

var journeySchema= mongoose.Schema({
 date: String,
 journey:String,
 departureTime:String,
 price:Number
})

var userSchema = mongoose.Schema({
    name: String,
    firstname:String,
    email: String,
    password: String,
    journeys: [journeySchema]
})

var userModel = mongoose.model('users', userSchema)

module.exports = userModel;