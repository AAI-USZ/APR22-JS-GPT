var format = require('util').format;
var util = require('./util');


var renderBrowser = function(browser) {
var totalExecuted = browser.lastResult.success + browser.lastResult.failed;
var msg = format('%s: Executed %d of %d', browser, totalExecuted, browser.lastResult.total);

if (browser.lastResult.failed) {
msg += ' \033[31m(' + browser.lastResult.failed + ' failed)\033[39m';
}

if (browser.isReady) {
var skipped = browser.lastResult.total - totalExecuted;
if (skipped) {
