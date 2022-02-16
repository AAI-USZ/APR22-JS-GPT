var fs = require('fs');

module.exports = function(callback){
var pluginDir = hexo.plugin_dir;

fs.exists(pluginDir, function(exist){
if (exist){
fs.readdir(pluginDir, function(err, files){
if (err) throw err;

for (var i=0, len=files.length; i<len; i++){
