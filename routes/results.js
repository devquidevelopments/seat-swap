var express = require('express');
var router = express.Router();
var moment = require('moment');
var Amadeus = require('amadeus');
require('dotenv').config();

var amadeus = new Amadeus({
  clientId: process.env.AMADEUS_KEY,
  clientSecret: process.env.AMADEUS_SECRET
});

/* GET home page. */
router.get('/', async (req, res, next) => {
  var dep = req.query.airline.split(" ")[0];
  var depDate = req.query.date;
  var fNumber = req.query.fNumber;
  amadeus.schedule.flights.get({
    carrierCode: dep,
    flightNumber: fNumber,
    scheduledDepartureDate: depDate
  }).then(function (response) {
    var data = response.data[0];
    var date = moment();
    var currDate = date.format('YYYY-MM-DD');
    var airline = req.query.airline.split(" ")[1];
    var depInfo = data.flightPoints[0];
    var depTime = depInfo.departure.timings[0].value.split("T")[1].split("+")[0];
    var depAP = depInfo.iataCode;
    var arrInfo = data.flightPoints[1];
    var arrDate = arrInfo.arrival.timings[0].value.split("T")[0]
    var arrTime = arrInfo.arrival.timings[0].value.split("T")[1].split("+")[0].slice(0, -1);
    var arrAP = arrInfo.iataCode;
    var number = [data.flightDesignator.carrierCode, data.flightDesignator.flightNumber].join("");
    var flight = JSON.parse(
      `{
        "airline": "${airline}",
        "departureDate": "${depDate}",
        "departureTime": "${depTime}",
        "departureAirportCode": "${depAP}",
        "flightNumber": "${number}",
        "arrivalDate": "${arrDate}",
        "arrivalTime": "${arrTime}",
        "arrivalAirportCode": "${arrAP}",
        "flightDetails": "${dep} ${fNumber} ${depDate}"
      }`);
    res.render('results', { title: 'My Seat Swap', date: currDate, flight: flight });
  }).catch(function (response) {
    console.error(response);
    res.render('index', { title: 'My Seat Swap' })
  });
});

module.exports = router;