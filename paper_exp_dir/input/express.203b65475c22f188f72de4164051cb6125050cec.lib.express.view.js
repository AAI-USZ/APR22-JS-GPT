




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



function cacheView(path) {
