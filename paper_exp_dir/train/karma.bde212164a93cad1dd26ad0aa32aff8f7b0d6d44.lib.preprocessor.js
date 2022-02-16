var mm     = require('minimatch');
var fs     = require('fs');
var crypto = require('crypto');
var util   = require('util');

var u      = require('./util');
var log    = require('./logger').create('preprocess');


var sha1 = function(data) {
