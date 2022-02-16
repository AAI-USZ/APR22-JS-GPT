var extend = require('../extend'),
render = extend.render.list(),
tag = extend.tag.list(),
render = require('../render'),
util = require('../util'),
file = util.file,
yfm = util.yfm,
path = require('path'),
fs = require('fs'),
async = require('async'),
swig = require('swig'),
_ = require('underscore');

swig.init({tags: tag});

var load = function(source, callback){
var extname = path.extname(source),
moment = require('../moment');
