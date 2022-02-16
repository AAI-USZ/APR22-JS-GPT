var path = require('path');
var fs = require('graceful-fs');
var crypto = require('crypto');
var mm = require('minimatch');

var log = require('./logger').create('preprocess');


var TMP = process.env.TMPDIR || process.env.TMP || process.env.TEMP || '/tmp';

var sha1 = function(data) {
