var fs = require('graceful-fs'),
async = require('async'),
path = require('path'),
sep = path.sep,
yaml = require('yamljs'),
EventEmitter = require('events').EventEmitter,
_ = require('underscore'),
cache = require('./cache'),
i18n = require('./i18n'),
util = require('./util'),
file = util.file;

module.exports = function(root, options, callback){
async.parallel([
function(next){
file.read(__dirname + '/../package.json', next);
},
function(next){
cache.init(root, next);
},
function(next){
fs.exists(root + '/_config.yml', function(exist){
if (!exist) return next();

file.read(root + '/_config.yml', function(err, content){
if (err) throw new Error('Failed to read file: ' + root + '/_config.yml');
next(null, yaml.parse(content));
});
});
}
], function(err, result){
if (err) throw new Error('Initialize Error');

