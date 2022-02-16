var Q = require('q');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var uuid = require('node-uuid');
var object = require('mout/object');
var fs = require('fs');
var object = require('mout/object');

exports.require = function (name) {
return require(path.join(__dirname, '../', name));
};


after(function () {
rimraf.sync(path.join(__dirname, 'tmp'));
});
