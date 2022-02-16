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

suite.after_ = null;
suite.before_ = null;
suite.queue = null;
};

this.reportSpecStarting = function(spec) {
spec.results_.time = new Date().getTime();
};

this.reportSpecResults = function(spec) {
var result = {
id: spec.id,
description: spec.description,
suite: [],
success: spec.results_.failedCount === 0,
skipped: spec.results_.skipped,
time: spec.results_.skipped ? 0 : new Date().getTime() - spec.results_.time,
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


spec.results_ = null;
spec.spies_ = null;
spec.queue = null;
};

this.log = function() {};
};


var createStartFn = function(tc, jasmineEnvPassedIn) {
return function(config) {


var jasmineEnv = jasmineEnvPassedIn || window.jasmine.getEnv();
var currentSpecsCount = jasmineEnv.nextSpecId_;
var lastCount = tc.store('jasmine.lastCount');
var lastFailedIds = tc.store('jasmine.lastFailedIds');

tc.store('jasmine.lastCount', currentSpecsCount);
tc.store('jasmine.lastFailedIds', []);


if (lastCount === currentSpecsCount &&
lastFailedIds.length > 0 &&
!jasmineEnv.exclusive_) {

jasmineEnv.specFilter = function(spec) {
return indexOf(lastFailedIds, spec.id) !== -1;
};
}



jasmineEnv.addReporter(new TestacularReporter(tc));
jasmineEnv.execute();
};
};


var createDumpFn = function(tc, serialize) {
return function() {

var args = Array.prototype.slice.call(arguments, 0);

if (serialize) {
for (var i = 0; i < args.length; i++) {
args[i] = serialize(args[i]);
}
}

tc.info({dump: args});
};
};
