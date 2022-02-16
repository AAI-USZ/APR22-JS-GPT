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



var SimpleReporter = function(sj, failedIds) {

this.reportRunnerStarting = function(runner) {
sj.info({total: runner.specs().length});
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
var steps = spec.results_.items_;
for (var i = 0; i < steps.length; i++) {
if (!steps[i].passed_) {
result.log.push(formatFailedStep(steps[i]));
}
}

failedIds.push(result.id);
}

sj.result(result);
};

this.log = function() {};
};


var createStartFn = function(sj, jasmineEnv) {
return function(config) {


jasmineEnv = jasmineEnv || window.jasmine.getEnv();

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

jasmineEnv.specFilter = function(spec) {
return lastResults.failedIds.indexOf(spec.id) !== -1;
};
}

jasmineEnv.addReporter(new SimpleReporter(sj, currentFailedIds));
jasmineEnv.execute();
};
};


var createDumpFn = function(sj, serialize) {
return function() {

var args = Array.prototype.slice.call(arguments, 0);

if (serialize) {
