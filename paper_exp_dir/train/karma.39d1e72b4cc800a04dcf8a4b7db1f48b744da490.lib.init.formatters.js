var fs = require('fs');
var util = require('util');

var JS_TEMPLATE_PATH = __dirname + '/../../config.tpl.js';
var COFFEE_TEMPLATE_PATH = __dirname + '/../../config.tpl.coffee';
var JS_REQUIREJS_TEMPLATE_PATH = __dirname + '/../../requirejs.config.tpl.js';
var COFFEE_REQUIREJS_TEMPLATE_PATH = __dirname + '/../../requirejs.config.tpl.coffee';
var COFFEE_REGEXP = /\.coffee$/;
var LIVE_TEMPLATE_PATH = __dirname + '/../../config.tpl.ls';
var LIVE_REGEXP = /\.ls$/;


var isCoffeeFile = function(filename) {
return COFFEE_REGEXP.test(filename);
};

var isLiveFile = function(filename) {
return LIVE_REGEXP.test(filename);
};

var JavaScriptFormatter = function() {

var quote = function(value) {
return '\'' + value + '\'';
};

var quoteNonIncludedPattern = function(value) {
return util.format('{pattern: %s, included: false}', quote(value));
};

var pad = function(str, pad) {
return str.replace(/\n/g, '\n' + pad).replace(/\s+$/gm, '');
};

var formatQuottedList = function(list) {
return list.map(quote).join(', ');
};

this.TEMPLATE_FILE_PATH = JS_TEMPLATE_PATH;
this.REQUIREJS_TEMPLATE_FILE = JS_REQUIREJS_TEMPLATE_PATH;

this.formatFiles = function(includedFiles, onlyServedFiles) {
var files = includedFiles.map(quote);

onlyServedFiles.forEach(function(onlyServedFile) {
files.push(quoteNonIncludedPattern(onlyServedFile));
});

files = files.map(function(file) {
return '\n      ' + file;
});

return files.join(',');
};

this.formatPreprocessors = function(preprocessors) {
var lines = [];
