

describe('adapter qunit', function() {
describe('reporter', function() {
var runner, tc;

beforeEach(function() {
tc = new Testacular(new MockSocket(), {});
runner = new Emitter();
window.QUnit = runner;
reporter = new (createQUnitStartFn(tc))();
});


describe('done', function() {

it('should report complete', function() {
spyOn(tc, 'complete');

runner.emit('done');
