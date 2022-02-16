var util = require('./util'),
file = util.file,
fs = require('graceful-fs'),
_ = require('underscore'),
store = {},
cachePath;

exports.init = function(root, callback){
cachePath = root + '/.cache';
fs.exists(cachePath, function(exist){
if (exist){
file.read(cachePath, function(err, content){
if (err) throw new Error('Failed to read file: ' + cachePath);
try {
store = JSON.parse(content);
} catch(e){

}
callback();
});
