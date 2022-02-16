var fs = require('fs'),
async = require('async'),
yaml = require('yamljs');

module.exports = function(root, callback){
async.parallel([
function(next){
fs.readFile(root + '/package.json', 'utf8', next);
},
function(next){
