var semver = require('semver');
var fs = require('hexo-fs');

module.exports = function(ctx){
var db = ctx.database;
var path = db.options.path;
var log = ctx.log;

return fs.exists(path).then(function(exist){
if (!exist) return;

