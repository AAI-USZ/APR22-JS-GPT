

describe('jasmine adapter', function() {
describe('SimpleReporter', function() {
var reporter, slimjim, failedIds, env, suite, spec;

beforeEach(function() {
slimjim = jasmine.createSpyObj('__slimjim__', ['result']);
failedIds = [];
reporter = new SimpleReporter(slimjim, failedIds);

env = new jasmine.Env();
var parentSuite = new jasmine.Suite(env, 'parent');
suite = new jasmine.Suite(env, 'child', function() {}, parentSuite);
spec = new jasmine.Spec(env, suite, 'should test');
});


it('should report success result', function() {
slimjim.result.andCallFake(function(result) {
expect(result.id).toBe(spec.id);
expect(result.description).toBe('should test');
expect(result.suite).toEqual(['parent', 'child']);
expect(result.success).toBe(true);
});

reporter.reportSpecResults(spec);
expect(slimjim.result).toHaveBeenCalled();
});


it('should report fail result', function() {
spec.fail(new Error('whatever'));

slimjim.result.andCallFake(function(result) {
expect(result.success).toBe(false);
expect(result.log.length).toBe(1);
});

reporter.reportSpecResults(spec);
expect(slimjim.result).toHaveBeenCalled();
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

expect(failedIds).toEqual([1, 2]);
});


it('should remove jasmine-specific frames from the exception stack traces', function() {
var error = new Error('my custom');
error.stack = "Error: Expected 'function' to be 'fxunction'.\n"+
"    at new <anonymous> (http://localhost:8080/lib/jasmine/jasmine.js:102:32)\n"+
"    at [object Object].toBe (http://localhost:8080/lib/jasmine/jasmine.js:1171:29)\n"+
"    at [object Object].<anonymous> (http://localhost:8080/test/resourceSpec.js:2:3)\n"+
"    at [object Object].execute (http://localhost:8080/lib/jasmine/jasmine.js:1001:15)";

spec.fail(error);
