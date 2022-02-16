var path = require('path'),
async = require('async'),
util = require('../util'),
log = util.log,
file = util.file,
spawn = util.spawn;

module.exports = function(args){
var target = process.cwd();

if (args[0]) target = path.resolve(target, args[0]);

