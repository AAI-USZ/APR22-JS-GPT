var fs = require('hexo-fs');
var Promise = require('bluebird');

module.exports = function(ctx){
if (ctx._dbLoaded) return Promise.resolve();

var db = ctx.database;
var path = db.options.path;
var log = ctx.log;

return fs.exists(path).then(function(exist){
if (!exist) return;
