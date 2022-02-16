var path = require('path'),
fs = require('graceful-fs'),
_ = require('lodash'),
util = require('../../util'),
file = util.file2;

if (!fs.exists || !fs.existsSync){
fs.exists = path.exists;
fs.existsSync = path.existsSync;
}

var cache = {};
