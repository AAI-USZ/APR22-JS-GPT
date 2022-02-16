var config = require('./config'),
file = require('./file'),
log = require('./log'),
async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
stylus = require('stylus'),
nib = require('nib'),
less = require('less'),
sass = require('node-sass'),
coffee = require('coffee-script'),
yaml = require('yamljs');

exports.asset = function(callback){
var themeDir = __dirname + '/../themes/' + config.theme;

async.parallel([
function(next){
file.dir(themeDir + '/css', function(files){
async.forEach(files, function(item, next){
var extname = path.extname(item),
filename = path.basename(item, extname),
dirname = path.dirname(item),
