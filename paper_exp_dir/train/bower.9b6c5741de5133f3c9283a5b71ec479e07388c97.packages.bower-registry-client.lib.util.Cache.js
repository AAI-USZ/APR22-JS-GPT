var fs = require('fs');
var path = require('path');
var async = require('async');
var mkdirp = require('mkdirp');

var hasOwn =  Object.prototype.hasOwnProperty;

var Cache = function (dir, options) {
options = options || {};


if (typeof options.maxAge !== 'number') {
options.maxAge = 5 * 24 * 60 * 60 * 1000;
}
