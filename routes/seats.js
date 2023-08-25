var express = require('express');
var router = express.Router();
var moment = require('moment');
var Amadeus = require('amadeus');
var { Client } = require('pg');

require('dotenv').config();

var amadeus = new Amadeus({
	clientId: process.env.AMADEUS_KEY,
	clientSecret: process.env.AMADEUS_SECRET
});

const connectDb = async () => {
	try {
		const client = new Client({
			user: process.env.PGUSER,
			host: process.env.PGHOST,
			database: process.env.PGDATABASE,
			password: process.env.PGPASSWORD,
			port: process.env.PGPORT
		});

		await client.connect();
		const res = await client.query('SELECT * FROM some_table');
		console.log(res);
		await client.end();
	} catch (error) {
		console.log(error);
	}
};

/* GET home page. */
router.get('/', async (req, res, next) => {
	var flightInfo = req.query.flight_details.split(" ");
	amadeus.schedule.flights.get({
		carrierCode: flightInfo[0],
		flightNumber: flightInfo[1],
		scheduledDepartureDate: flightInfo[2]
	}).then(function (response) {
		var data = response.data[0];
		var date = moment();
		var currDate = date.format('YYYY-MM-DD');
		var airline = "Ryanair";
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
            "departureAirportCode": "${depAP}",
            "flightNumber": "${number}",
            "arrivalTime": "${arrTime}",
            "arrivalAirportCode": "${arrAP}",
            "flightDetails": "${flightInfo}",
            "selectedSeat": "${req.query.seats}"
          }`);
		res.render('seats', { title: 'My Seat Swap', date: currDate, flight: flight });
	}).catch(function (response) {
		console.error(response.data);
	});
});

module.exports = router;
