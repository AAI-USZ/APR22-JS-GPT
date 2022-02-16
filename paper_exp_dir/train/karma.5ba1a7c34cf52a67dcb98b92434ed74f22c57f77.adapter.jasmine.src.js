var formatFailedStep = function(step) {

var stack = step.trace.stack;
if (stack) {
if (step.trace.message && stack.indexOf(step.trace.message) === -1) {
stack = step.trace.message + '\n' + stack;
}


return stack.replace(/\n.+jasmine\.js\?\d*\:.+(?=(\n|$))/g, '');
}

return step.trace.message || step.message;
};

var indexOf = function(collection, item) {
if (collection.indexOf) return collection.indexOf(item);

for (var i = 0, ii = collection.length; i < ii; i++) {
if (collection[i] === item) return i;
}

return -1;
};



var TestacularReporter = function(tc) {

var failedIds = [];

this.reportRunnerStarting = function(runner) {
tc.info({total: runner.specs().length});
};

this.reportRunnerResults = function(runner) {
tc.store('jasmine.lastFailedIds', failedIds);
tc.complete();
};

this.reportSuiteResults = function(suite) {
};

this.reportSpecStarting = function(spec) {
spec.results_.time = Date.now();
};

this.reportSpecResults = function(spec) {
var result = {
id: spec.id,
description: spec.description,
suite: [],
success: spec.results_.failedCount === 0,
skipped: spec.results_.skipped,
