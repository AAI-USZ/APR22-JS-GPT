if (!window.console || !window.console.log) {
window.console = {
log: function() {}
};
}

window.dump = function() {
__slimjim__.info(Array.prototype.slice.call(arguments, 0));
};


var SimpleReporter = function() {

this.reportRunnerStarting = function(runner) {
var count = runner.specs().length;
__slimjim__.info('Running ' + count + ' specs...');
};

this.reportRunnerResults = function(runner) {
__slimjim__.complete();
};

this.reportSuiteResults = function(suite) {
};

this.reportSpecStarting = function(spec) {
};

this.reportSpecResults = function(spec) {
if (spec.results_.skipped) return;

var result = {
id: spec.id,
description: spec.description,
suite: [],
success: spec.results_.failedCount === 0,
log: []
};

