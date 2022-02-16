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

async.waterfall([
function(next){
file.read(source, function(err, result){
if (err) throw err;

fs.stat(source, function(err, stats){
if (err) throw err;
next(null, result, stats);
});
});
},
function(file, stats, next){
var meta = yfm(file);

meta.date = _.isDate(meta.date) ? moment(meta.date) : moment(meta.date, 'YYYY-MM-DD HH:mm:ss');
meta.updated = moment(stats.mtime);
meta.stats = stats;

var compiled = swig.compile(meta._content)();

render.render(compiled, extname.substring(1), function(err, result){
if (err) throw err;

delete meta._content;
meta.content = result.replace(/<\/?notextile>/g, '');

callback(meta);
});
