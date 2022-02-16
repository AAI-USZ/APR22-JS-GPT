var fs = require('graceful-fs'),
async = require('async'),
path = require('path'),
sep = path.sep,
yaml = require('yamljs'),
EventEmitter = require('events').EventEmitter,
_ = require('underscore'),
i18n = require('./i18n'),
util = require('./util'),
db = require('./db'),
file = util.file;

module.exports = function(root, options, callback){
async.parallel([
function(next){
fs.exists(root + '/_config.yml', function(exist){
if (!exist) return next();

file.read(root + '/_config.yml', function(err, content){
if (err) throw new Error('Failed to read file: ' + root + '/_config.yml');
next(null, yaml.parse(content));
});
