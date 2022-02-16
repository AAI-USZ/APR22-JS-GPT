var Promise = require('bluebird');
var util = require('../../util');
var fs = util.fs;

module.exports = function(ctx){
var log = ctx.log;
var dbPath = ctx.database.options.path;

function deleteDatabase(){
return fs.exists(dbPath).then(function(exist){
