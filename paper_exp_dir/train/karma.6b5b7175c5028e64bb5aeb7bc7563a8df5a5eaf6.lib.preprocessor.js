var mm = require('minimatch');
var coffee = require('coffee-script');
var live = require('LiveScript');
var fs = require('fs');
var crypto = require('crypto');
var util = require('util');

var logger = require('./logger');
var log = logger.create('preprocess');
var logCoffee = logger.create('preprocess.coffee');
var logLive = logger.create('preprocess.ls');
var logHtml2Js = logger.create('preprocess.html2js');
