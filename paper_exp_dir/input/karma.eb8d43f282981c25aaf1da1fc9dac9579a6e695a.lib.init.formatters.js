var fs = require('fs');
var util = require('util');

var JS_TEMPLATE_PATH = __dirname + '/../../config.tpl.js';
var COFFEE_TEMPLATE_PATH = __dirname + '/../../config.tpl.coffee';
var COFFEE_REGEXP = /\.coffee$/;


var isCoffeeFile = function(filename) {
return COFFEE_REGEXP.test(filename);
};


var JavaScriptFormatter = function() {

var quote = function(value) {
return '\'' + value + '\'';
};

var quoteNonIncludedPattern = function(value) {
return util.format('{pattern: %s, included: false}', quote(value));
};

var pad = function(str, pad) {
return str.replace(/\n/g, '\n' + pad);
};

