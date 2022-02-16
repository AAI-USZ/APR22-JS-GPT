var async = require('async'),
fs = require('graceful-fs'),
_ = require('lodash'),
pathFn = require('path'),
colors = require('colors'),
stream = require('stream'),
Stream = stream.Stream,
Readable = stream.Readable,
util = require('../../util'),
file = util.file2,
HexoError = require('../../error');

module.exports = function(args, callback){
var watch = args.w || args.watch,
