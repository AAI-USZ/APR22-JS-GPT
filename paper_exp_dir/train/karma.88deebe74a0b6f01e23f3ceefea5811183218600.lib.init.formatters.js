var fs = require('fs');
var util = require('util');

var JS_TEMPLATE_PATH = __dirname + '/../../config.tpl.js';
var COFFEE_TEMPLATE_PATH = __dirname + '/../../config.tpl.coffee';
var COFFEE_REGEXP = /\.coffee$/;
var LIVE_TEMPLATE_PATH = __dirname + '/../../config.tpl.ls';
var LIVE_REGEXP = /\.ls$/;


var isCoffeeFile = function(filename) {
return COFFEE_REGEXP.test(filename);
};

var isLiveFile = function(filename) {
return LIVE_REGEXP.test(filename);
