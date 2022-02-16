var path = require('path');
var fs = require('fs');
var os = require('os');
var rimraf = require('rimraf');
var log = require('./logger').create('temp-dir');


var TEMP_DIR = os.tmpdir ? os.tmpdir() : os.tmpDir();

module.exports = {
getPath: function(suffix) {
return path.normalize(TEMP_DIR + suffix);
},

create: function(path) {
log.debug('Creating temp dir at %s', path);
