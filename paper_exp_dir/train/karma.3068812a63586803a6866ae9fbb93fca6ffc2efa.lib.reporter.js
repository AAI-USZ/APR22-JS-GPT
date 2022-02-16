var util = require('util');
var u = require('./util');
var builder = require('xmlbuilder');
var fs = require('fs');
var os = require("os");
var log = require('./logger').create('reporter');
var path = require('path');


var createErrorFormatter = function(basePath, urlRoot) {
var URL_REGEXP = new RegExp('http:\\/\\/[^\\/]*' + urlRoot.replace(/\
'(base|absolute)([^\\?\\s]*)(\\?[0-9]*)?', 'g');

return function(msg, indentation) {


msg = msg.replace(URL_REGEXP, function(full, prefix, path) {
if (prefix === 'base') {
return basePath + path;
} else if (prefix === 'absolute') {
return path;
}
});


if (indentation) {
msg = indentation + msg.replace(/\n/g, '\n' + indentation);
}

return msg + '\n';
};
};



var BaseReporter = function(formatError, reportSlow, adapter) {
this.adapters = [adapter || process.stdout.write.bind(process.stdout)];


this.renderBrowser = function(browser) {
var results = browser.lastResult;
var totalExecuted = results.success + results.failed;
var msg = util.format('%s: Executed %d of %d', browser, totalExecuted, results.total);
