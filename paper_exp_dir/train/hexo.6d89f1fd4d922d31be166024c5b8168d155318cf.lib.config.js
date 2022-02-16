var fs = require('fs'),
async = require('async'),
sep = require('path').sep,
yaml = require('yamljs'),
i18n = require('./i18n'),
util = require('./util'),
file = util.file;

module.exports = function(root, callback){
async.parallel([
function(next){
file.read(__dirname + '/../package.json', next);
},
function(next){
