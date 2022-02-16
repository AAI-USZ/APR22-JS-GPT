var fs = require('fs');
var path = require('path');
var async = require('async');
var mkdirp = require('mkdirp');

var hasOwn =  Object.prototype.hasOwnProperty;

function Cache(dir, options) {
options = options || {};


if (typeof options.maxAge !== 'number') {
options.maxAge = 5 * 24 * 60 * 60 * 1000;
}

this._dir = dir;
this._options = options;
this._cache = {};





if (dir) {
mkdirp.sync(dir);
}
}

Cache.prototype.get = function (key, callback) {
var file;
