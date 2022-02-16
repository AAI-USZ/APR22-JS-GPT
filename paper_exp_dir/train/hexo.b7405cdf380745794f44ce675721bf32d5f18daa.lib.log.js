var clc = require('cli-color'),
fs = require('graceful-fs'),
util = require('util'),
ansiTrim = require('cli-color/lib/trim');

var printLog = function(args, message, color){
var content = util.format.apply(undefined, args),
date = new Date().toISOString();

console.log('%s [%s] %s', date, clc[color](message), content);

};
