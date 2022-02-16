

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
