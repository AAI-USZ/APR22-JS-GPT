var util = require('util');

var helper = require('../helper');


var BaseReporter = function(formatError, reportSlow, adapter) {
this.adapters = [adapter || process.stdout.write.bind(process.stdout)];

this.onRunStart = function(browsers) {
this._browsers = browsers;
};


this.renderBrowser = function(browser) {
var results = browser.lastResult;
var totalExecuted = results.success + results.failed;
var msg = util.format('%s: Executed %d of %d', browser, totalExecuted, results.total);

if (results.failed) {
