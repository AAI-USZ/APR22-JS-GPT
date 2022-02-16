var fs = require('fs'),
path = require('path'),
async = require('async'),
_ = require('underscore'),
sep = path.sep;

if (!fs.exists || !fs.existsSync){
fs.exists = path.exists;
fs.existsSync = path.existsSync;
}

var mkdir = exports.mkdir = function(destination, callback){
