var Q = require('q');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var uuid = require('node-uuid');
var object = require('mout/object');
var fs = require('fs');
var object = require('mout/object');
var config = require('../lib/config');

exports.require = function (name) {
return require(path.join(__dirname, '../', name));
};


beforeEach(function () {
config.reset();
});

