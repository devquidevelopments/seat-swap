var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  res.render('confirm', { title: 'My Seat Swap' });
});

module.exports = router;