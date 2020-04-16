var express = require('express');
var router = express.Router();
let path = require('path')

/* GET home page. */
router.get('/', function(req, res, next) {

    let file= path.join(__dirname, '../csvTemplate/template1.csv')
  res.download(file);
});

module.exports = router;