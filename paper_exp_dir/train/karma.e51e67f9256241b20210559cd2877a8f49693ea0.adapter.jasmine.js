if (!window.console || !window.console.log) {
window.console = {
log: function() {}
};
}

window.dump = function() {
__slimjim__.info(Array.prototype.slice.call(arguments, 0));
};


var SimpleReporter = function(sj, failedIds) {

this.reportRunnerStarting = function(runner) {
var count = runner.specs().length;
sj.info('Running ' + count + ' specs...');
};

this.reportRunnerResults = function(runner) {
sj.complete();
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

var suitePointer = spec.suite;
while (suitePointer) {
result.suite.unshift(suitePointer.description);
suitePointer = suitePointer.parentSuite;
}

if (!result.success) {
var items = spec.results_.items_;
for (var i = 0; i < items.length; i++) {
if (items[i].trace) {
result.log.push(items[i].trace.stack);
}
}

failedIds.push(result.id);
}

sj.result(result);
};

this.log = function() {
};
};

var createStartFn = function(sj, jasmineEnv) {
return function(config) {
var currentFailedIds = [];
var currentSpecsCount = jasmineEnv.nextSpecId_;
var lastResults = sj.jasmineLastResults;



sj.jasmineLastResults = {
failedIds: currentFailedIds,
count: currentSpecsCount
};


if (lastResults && lastResults.count === currentSpecsCount &&
lastResults.failedIds.length > 0 &&
!jasmineEnv.exclusive_) {
