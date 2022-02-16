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

if (!browser.lastResult.failed) {
msg += ' \033[32mSUCCESS\033[39m';
}
}

return msg;
};


var ProgressBarRenderer = function() {
var browsers = [];

this.remove = function() {
var cmd = '';
browsers.forEach(function() {
cmd += '\033[1A' + '\033[2K';
});

return cmd;
};

this.render = function(browser) {
if (browser && browsers.indexOf(browser) === -1) {
browsers.push(browser);
}

return browsers.map(renderBrowser).join('\n') + '\n';
};

this.refresh = function(browser) {
return this.remove() + this.render(browser);
};
};


var Progress = function(adapter) {
var renderer = new ProgressBarRenderer();


this.adapters = [adapter || process.stdout.write.bind(process.stdout)];


this.write = function() {
var msg = util.format.apply(null, Array.prototype.slice.call(arguments));

this.adapters.forEach(function(adapter) {
adapter(msg);
});
};

this.writeCommonMsg = function(msg, browser) {
this.write(renderer.remove() + msg + renderer.render(browser));
};


this.error = function(browser, error) {
