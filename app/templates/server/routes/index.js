var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require("path");

router.get('partials', function(req, res, next){
  console.log(req);
  res.render(req.route);
});

/* GET home page. */
router.all('/*', function(req, res, next) {
  res.render('index', { title: '<%= app.name %>' });//clientBundle : clientBundle, vendorBundle : vendorBundle
});

module.exports = router;
