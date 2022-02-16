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
var hash = crypto.createHash('sha1');
hash.update(data);
return hash.digest('hex');
};



var processCoffee = function(content, file, basePath, done) {
logCoffee.debug('Processing "%s".', file.originalPath);
file.path = file.originalPath + '-compiled.js';

var processed = null;
try {
processed = coffee.compile(content, {bare: true});
} catch (e) {
logCoffee.error('%s\n  at %s', e.message, file.originalPath);
