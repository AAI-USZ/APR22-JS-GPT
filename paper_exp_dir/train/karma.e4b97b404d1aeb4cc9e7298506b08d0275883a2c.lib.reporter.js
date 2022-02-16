var util = require('util');
var u = require('./util');


var renderBrowser = function(browser) {
var totalExecuted = browser.lastResult.success + browser.lastResult.failed;
var msg = util.format('%s: Executed %d of %d', browser, totalExecuted, browser.lastResult.total);

if (browser.lastResult.failed) {
msg += ' \033[31m(' + browser.lastResult.failed + ' failed)\033[39m';
}

if (browser.isReady) {
var skipped = browser.lastResult.total - totalExecuted;
if (skipped) {
msg += util.format(' (skipped %d)', skipped);
}

if (browser.lastResult.disconnected) {
msg += ' \033[31mDISCONNECTED\033[39m';
} else if (browser.lastResult.error) {
msg += ' \033[31mERROR\033[39m';
} else if (!browser.lastResult.failed) {
msg += ' \033[32mSUCCESS\033[39m';
}
}

return msg;
};

