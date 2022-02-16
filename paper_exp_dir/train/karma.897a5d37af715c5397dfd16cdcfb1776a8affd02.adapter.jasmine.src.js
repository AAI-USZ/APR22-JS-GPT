
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
var steps = spec.results_.items_, step;
for (var i = 0; i < steps.length; i++) {
step = steps[i];

if (!step.passed_) {
result.log.push(step.trace.stack ?
step.trace.stack.replace(/\n.+jasmine\.js\:.+(?=(\n|$))/g, '') : step.message);
}
}

failedIds.push(result.id);
}
