var helper = require('./extend').helper.list(),
render = require('./render'),
theme = require('./theme'),
util = require('./util'),
file = util.file,
yfm = util.yfm,
async = require('async'),
fs = require('fs'),
moment = require('moment'),
path = require('path'),
swig = require('swig'),
_ = require('underscore');

swig.init({tags: helper});

var regex = {
excerpt: /<!--\s*more\s*-->/
};

var load = function(source, callback){
var extname = path.extname(source);

async.waterfall([
function(next){
file.read(source, function(err, result){
if (err) throw err;
fs.stat(source, function(err, stats){
if (err) throw err;
next(null, result, stats);
});
});
