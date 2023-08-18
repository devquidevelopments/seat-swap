var express = require('express');
var router = express.Router();
var moment = require('moment');

/* GET home page. */
router.get('/', async (req, res, next) => {
  var date = moment();
  var currDate = date.format('YYYY-MM-DD');
  res.render('index', { title: 'My Seat Swap', date: currDate });
});

module.exports = router;
