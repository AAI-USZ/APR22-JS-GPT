

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


