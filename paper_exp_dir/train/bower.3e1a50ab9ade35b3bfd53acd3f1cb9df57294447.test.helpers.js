var Q = require('q');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var uuid = require('node-uuid');
var object = require('mout/object');
var fs = require('fs');
var glob = require('glob');
var os = require('os');
var cmd = require('../lib/util/cmd');
var config = require('../lib/config');

var tmpLocation = path.join(os.tmpdir ? os.tmpdir() : os.tmpDir(), 'bower-tests');

exports.require = function (name) {
return require(path.join(__dirname, '../', name));
};

