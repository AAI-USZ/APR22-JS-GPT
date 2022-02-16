var util = require('util');


var BaseReporter = function(formatError, reportSlow, adapter) {
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
}

if (browser.isReady) {
if (results.disconnected) {
msg += this.FINISHED_DISCONNECTED;
} else if (results.error) {
msg += this.FINISHED_ERROR;
} else if (!results.failed) {
msg += this.FINISHED_SUCCESS;
}

