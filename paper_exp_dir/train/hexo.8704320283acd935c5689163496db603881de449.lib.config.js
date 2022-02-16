var fs = require('fs'),
async = require('async'),
yaml = require('yamljs'),
sep = require('path').sep;

module.exports = function(root, callback){
async.parallel([
function(next){
fs.readFile(__dirname + '/../package.json', 'utf8', next);
},
function(next){
fs.exists(root + '/_config.yml', function(exist){
