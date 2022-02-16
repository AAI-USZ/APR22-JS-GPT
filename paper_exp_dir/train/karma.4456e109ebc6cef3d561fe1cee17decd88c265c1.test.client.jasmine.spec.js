

describe('jasmine adapter', function() {
describe('TestacularReporter', function() {
var reporter, testacular, failedIds, env, suite, spec;

beforeEach(function() {
testacular = new Testacular(new MockSocket(), {});
reporter = new TestacularReporter(testacular);
spyOn(testacular, 'result');

env = new jasmine.Env();
var parentSuite = new jasmine.Suite(env, 'parent');
suite = new jasmine.Suite(env, 'child', function() {}, parentSuite);
spec = new jasmine.Spec(env, suite, 'should test');
});


it('should report success result', function() {
testacular.result.andCallFake(function(result) {
expect(result.id).toBe(spec.id);
expect(result.description).toBe('should test');
expect(result.suite).toEqual(['parent', 'child']);
expect(result.success).toBe(true);
expect(result.skipped).toBe(false);
});

reporter.reportSpecResults(spec);
expect(testacular.result).toHaveBeenCalled();
});


it('should report fail result', function() {
spec.fail(new Error('whatever'));

testacular.result.andCallFake(function(result) {
expect(result.success).toBe(false);
expect(result.log.length).toBe(1);
});

reporter.reportSpecResults(spec);
expect(testacular.result).toHaveBeenCalled();
});


it('should report failed ids', function() {
var specs = [
spec,
new jasmine.Spec(env, suite, 'should test'),
new jasmine.Spec(env, suite, 'should test'),
new jasmine.Spec(env, suite, 'should test')
];

specs[1].fail(new Error('Some error'));
specs[2].fail(new Error('Another error'));

while(specs.length) {
reporter.reportSpecResults(specs.shift());
}
reporter.reportRunnerResults();

expect(testacular.store('jasmine.lastFailedIds')).toEqual([1, 2]);
});


it('should remove jasmine-specific frames from the exception stack traces', function() {
var error = new Error("Expected 'function' to be 'fxunction'");
error.stack = "Error: Expected 'function' to be 'fxunction'.\n" +
"    at new <anonymous> (http://localhost:8080/lib/jasmine/jasmine.js?123412234:102:32)\n" +
"    at [object Object].toBe (http://localhost:8080/lib/jasmine/jasmine.js?123:1171:29)\n" +
"    at [object Object].<anonymous> (http://localhost:8080/test/resourceSpec.js:2:3)\n" +
"    at [object Object].execute (http://localhost:8080/lib/jasmine/jasmine.js?123:1001:15)";

spec.fail(error);

testacular.result.andCallFake(function(result) {
expect(result.log).toEqual([
"Error: Expected 'function' to be 'fxunction'.\n"+
"    at [object Object].<anonymous> (http://localhost:8080/test/resourceSpec.js:2:3)"
]);
});

reporter.reportSpecResults(spec);
expect(testacular.result).toHaveBeenCalled();
});


it('should report time for every spec', function() {
var counter = 3;
spyOn(Date.prototype, 'getTime').andCallFake(function() {
return counter++;
});

testacular.result.andCallFake(function(result) {
expect(result.time).toBe(1);
});

reporter.reportSpecStarting(spec);
reporter.reportSpecResults(spec);

expect(testacular.result).toHaveBeenCalled();
});
});


describe('formatFailedStep', function() {

it('should prepend the stack with message if browser does not', function() {

expect(formatFailedStep(new jasmine.ExpectationResult({
passed: false,
message: 'Jasmine fail message',
trace: {
stack: '@file.js:123\n'
}
}))).toMatch(/^Jasmine fail message/);
});

it('should report message if no stack trace', function() {

expect(formatFailedStep(new jasmine.ExpectationResult({
passed: false,
message: 'MESSAGE',
