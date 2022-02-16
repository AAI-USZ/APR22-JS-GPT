var formatFailedStep = function(step) {

var stack = step.trace.stack;
var message = step.message;
if (stack) {

var firstLine = stack.substring(0, stack.indexOf('\n') - 1);
if (message && message.indexOf(firstLine) == -1) {
stack = message + '\n' + stack;
}


return stack.replace(/\n.+jasmine\.js\?\d*\:.+(?=(\n|$))/g, '');
}

return message;
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

suite.after_ = null
suite.before_ = null;
suite.queue = null;
};

this.reportSpecStarting = function(spec) {
spec.results_.time = new Date().getTime();
};

this.reportSpecResults = function(spec) {
var result = {
