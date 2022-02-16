

var extend = require('../extend'),
renderer = Object.keys(extend.renderer.list()),
tag = extend.tag.list(),
render = require('../render'),
util = require('../util'),
file = util.file,
yfm = util.yfm,
highlight = util.highlight,
path = require('path'),
fs = require('fs'),
async = require('async'),
swig = require('swig'),
_ = require('underscore');

swig.init({tags: tag});

var regex = {
codeBlock: /`{3} *([^\n]+)?\n(.+?)\n`{3}/,
AllOptions: /([^\s]+)\s+(.+?)(https?:\/\/\S+)\s*(.+)?/i,
LangCaption: /([^\s]+)\s*(.+)?/i
};

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
meta.stats = stats;

if (meta.updated) meta.updated = _.isDate(meta.updated) ? moment(meta.date) : moment(meta.date, 'YYYY-MM-DD HH:mm:ss');
else meta.updated = moment(stats.mtime);

var compiled = swig.compile(meta._content)().replace(regex.codeBlock, function(match, args, str){
if (!args) return match;

var captionPart = args.match(regex.AllOptions);
if (captionPart){
