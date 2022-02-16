var path = require('path'),
async = require('async'),
spawn = require('child_process').spawn,
util = require('../util'),
log = util.log,
file = util.file;

module.exports = function(args){
var target = process.cwd();

if (args[0]) target = path.resolve(target, args[0]);

