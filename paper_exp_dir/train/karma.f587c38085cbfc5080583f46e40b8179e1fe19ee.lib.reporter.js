var util = require('util');
var u = require('./util');

var BaseReporter = function(adapter) {
this.adapters = [adapter || process.stdout.write.bind(process.stdout)];


this.renderBrowser = function(browser) {
var results = browser.lastResult;
var totalExecuted = results.success + results.failed;
var msg = util.format('%s: Executed %d of %d', browser, totalExecuted, results.total);

if (results.failed) {
msg += util.format(this.X_FAILED, results.failed);
}

if (results.skipped) {
msg += util.format(' (skipped %d)', results.skipped);
