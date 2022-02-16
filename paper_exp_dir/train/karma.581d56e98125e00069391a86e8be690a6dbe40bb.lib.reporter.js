var util = require('util');
var u = require('./util');

var createErrorFormatter = function(basePath) {
var URL_REGEXP = /http:\/\/[^\/]*\/(base|absolute)([^\?\s]*)(\?[0-9]*)?/g;

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

var BaseReporter = function(formatError, adapter) {
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

msg += util.format(' (%d / %d secs)', results.totalTime / 1000, results.netTime / 1000);
}

return msg;
};

this.renderBrowser = this.renderBrowser.bind(this);


this.write = function() {
var msg = util.format.apply(null, Array.prototype.slice.call(arguments));

this.adapters.forEach(function(adapter) {
adapter(msg);
});
};

this.writeCommonMsg = this.write;


this.onBrowserError = function(browser, error) {
this.writeCommonMsg(util.format(this.ERROR, browser) + formatError(error, '\t'));
};


this.onBrowserDump = function(browser, dump) {
var msg = browser + ' DUMP: ';

if (dump.length > 1) {
msg += dump.length + ' entries\n' + dump.join('\n');
} else {
msg += dump[0];
}

this.writeCommonMsg(msg + '\n');
};


this.onSpecComplete = function(browser, result) {
if (result.skipped) {
this.specSkipped(browser, result);
} else if (result.success) {
this.specSuccess(browser, result);
} else {
this.specFailure(browser, result);
}
};


this.specSuccess = this.specSkipped = function() {};
