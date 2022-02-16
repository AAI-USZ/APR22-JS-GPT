var render = require('./render'),
util = require('./util'),
file = util.file,
yfm = util.yfm,
partial = util.partial,
async = require('async'),
path = require('path'),
_ = require('underscore'),
cache = {};

var config = exports.config = {};

exports.init = function(callback){
render.compile(hexo.theme_dir + 'config.yml', function(err, file){
