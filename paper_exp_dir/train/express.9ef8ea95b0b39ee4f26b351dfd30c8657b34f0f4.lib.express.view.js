




var extname = require('path').extname,
mime = require('connect/utils').mime,
utils = require('connect/utils'),
http = require('http'),
sys = require('sys'),
fs = require('fs');



var cache = {};



var viewCache = {};



exports.clearCache = function(){
viewCache = {};
};



var helpers = exports.helpers = {};



var dynamicHelpers = exports.dynamicHelpers = {};



function cacheView(path) {
fs.readFile(path, 'utf8', function(err, data){
if (!err) {
viewCache[path] = data;
}
});
