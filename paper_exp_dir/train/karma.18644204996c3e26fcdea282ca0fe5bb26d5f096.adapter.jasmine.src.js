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
var steps = spec.results_.items_;
for (var i = 0; i < steps.length; i++) {
if (!steps[i].passed_) {
result.log.push(formatFailedStep(steps[i]));
}
}

failedIds.push(result.id);
}

tc.result(result);
};

this.log = function() {};
};


var createStartFn = function(tc, jasmineEnv) {
return function(config) {


jasmineEnv = jasmineEnv || window.jasmine.getEnv();

var currentSpecsCount = jasmineEnv.nextSpecId_;
var lastCount = tc.store('jasmine.lastCount');
var lastFailedIds = tc.store('jasmine.lastFailedIds');

tc.store('jasmine.lastCount', currentSpecsCount);
tc.store('jasmine.lastFailedIds', []);
