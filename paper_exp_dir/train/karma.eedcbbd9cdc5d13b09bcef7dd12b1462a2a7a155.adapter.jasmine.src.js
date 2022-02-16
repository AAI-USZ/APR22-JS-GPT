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



var SimpleReporter = function(sj) {

var failedIds = [];

this.reportRunnerStarting = function(runner) {
sj.info({total: runner.specs().length});
};

this.reportRunnerResults = function(runner) {
sj.store('jasmine.lastFailedIds', failedIds);
sj.complete();
