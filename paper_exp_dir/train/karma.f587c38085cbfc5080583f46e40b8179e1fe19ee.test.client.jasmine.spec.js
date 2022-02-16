

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

