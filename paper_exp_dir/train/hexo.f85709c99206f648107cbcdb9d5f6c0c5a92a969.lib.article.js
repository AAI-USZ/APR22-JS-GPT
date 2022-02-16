var tag = require('./extend').tag.list(),
render = require('./render'),
theme = require('./theme'),
util = require('./util'),
file = util.file,
yfm = util.yfm,
async = require('async'),
fs = require('fs'),
path = require('path'),
swig = require('swig'),
_ = require('underscore');

swig.init({tags: tag});

var load = function(source, callback){
var extname = path.extname(source),
moment = require('./moment');

async.waterfall([
function(next){
file.read(source, function(err, result){
if (err) throw err;
fs.stat(source, function(err, stats){
