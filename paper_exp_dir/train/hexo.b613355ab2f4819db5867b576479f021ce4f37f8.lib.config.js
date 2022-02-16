var fs = require('fs'),
async = require('async'),
sep = require('path').sep,
yaml = require('js-yaml'),
i18n = require('./i18n');

module.exports = function(root, callback){
async.parallel([
function(next){
fs.readFile(__dirname + '/../package.json', 'utf8', next);
},
function(next){
