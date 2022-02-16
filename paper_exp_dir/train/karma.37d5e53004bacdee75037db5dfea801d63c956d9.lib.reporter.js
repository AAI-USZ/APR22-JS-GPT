var util = require('util');
var u = require('./util');

var BaseReporter = function(adapter) {
this.adapters = [adapter || process.stdout.write.bind(process.stdout)];


this.renderBrowser = function(browser) {
var totalExecuted = browser.lastResult.success + browser.lastResult.failed;
var msg = util.format('%s: Executed %d of %d', browser, totalExecuted, browser.lastResult.total);

if (browser.lastResult.failed) {
msg += util.format(this.X_FAILED, browser.lastResult.failed);
