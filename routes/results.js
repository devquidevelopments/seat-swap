var express = require('express');
var router = express.Router();
var moment = require('moment');
var axios = require('axios');
var Amadeus = require('amadeus');
require('dotenv').config();

var amadeus = new Amadeus({
  clientId: process.env.AMADEUS_KEY,
  clientSecret: process.env.AMADEUS_SECRET
});

/* GET home page. */
router.get('/', async (req, res, next) => {
  var dep = req.query.airline.split(" ")[0];
  var fDate = req.query.date;
  var fNumber = req.query.fNumber;
  amadeus.schedule.flights.get({
    carrierCode: dep,
    flightNumber: fNumber,
    scheduledDepartureDate: fDate
  }).then(function (response) {
    var data = response.data[0];
    var date = moment();
    var currDate = date.format('YYYY-MM-DD');
    var airline = req.query.airline.split(" ")[1];
    var depInfo = data.flightPoints[0];
    var depTime = depInfo.departure.timings[0].value.split("T")[1].split("+")[0];
    var depAP = depInfo.iataCode;
    var arrInfo = data.flightPoints[1];
    var arrTime = arrInfo.arrival.timings[0].value.split("T")[1].split("+")[0];
    var arrAP = arrInfo.iataCode;
    var number = [data.flightDesignator.carrierCode, data.flightDesignator.flightNumber].join("")
    var flight = JSON.parse(
      `{
        "airline": "${airline}",
        "departureTime": "${depTime}",
        "departureAirport": "${depAP}",
        "flightNumber": "${number}",
        "arrivalTime": "${arrTime}",
        "arrivalAirport": "${arrAP}"
      }`);
    res.render('results', { title: 'My Seat Swap', date: currDate, flight: flight });
  }).catch(function (response) {
    console.error(response);
  });
});

module.exports = router;