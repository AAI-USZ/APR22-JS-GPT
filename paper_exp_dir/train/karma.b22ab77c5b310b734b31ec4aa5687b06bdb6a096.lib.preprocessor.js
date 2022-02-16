var mm     = require('minimatch');
var fs     = require('fs');
var crypto = require('crypto');
var util   = require('util');

var helper = require('./helper');
var log    = require('./logger').create('preprocess');


var sha1 = function(data) {
var hash = crypto.createHash('sha1');
hash.update(data);
return hash.digest('hex');
};
