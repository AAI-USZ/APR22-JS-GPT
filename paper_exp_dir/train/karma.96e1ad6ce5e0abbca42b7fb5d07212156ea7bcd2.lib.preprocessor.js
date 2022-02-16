var mm = require('minimatch');
var coffee = require('coffee-script');
var fs = require('fs');
var crypto = require('crypto');
var util = require('util');

var logger = require('./logger');
var log = logger.create('preprocess');
var logCoffee = logger.create('preprocess.coffee');
var logHtml2Js = logger.create('preprocess.html2js');

var sha1 = function(data) {
