var path = require('path');
var fs = require('fs');
var TEMP_DIR = require('os').tmpdir();
var rimraf = require('rimraf');
var log = require('./logger').create('temp-dir');

module.exports = {
  getPath: function(suffix) {
    return path.normalize(TEMP_DIR + suffix);
  },

  create: function(path) {
    log.debug('Creating temp dir at %s', path);

    try {
      fs.mkdirSync(path);
    } catch (e) {
      log.warn('Failed to create a temp dir at %s', path);
    }

    return path;
  },

  remove: function(path, done) {
    log.debug('Cleaning temp dir %s', path);
    rimraf(path, done);
  }
};
