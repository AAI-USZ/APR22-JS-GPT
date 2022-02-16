

describe('adapter angular-scenario', function() {
describe('Test Results Reporter', function() {
var tc, model, passingSpec, failingSpec;
beforeEach(function () {
var stubRunner = {};
stubRunner.on = function(){};
model = new angular.scenario.ObjectModel(stubRunner);
passingSpec = new angular.scenario.ObjectModel.Spec('passId', 'Passing', ['Full', 'Passing']);
passingSpec.status = 'success';
passingSpec.duration = 15;
failingSpec = new angular.scenario.ObjectModel.Spec('failId', 'Failing', ['Full', 'Failing']);
failingSpec.status = 'error';
failingSpec.duration = 13;
failingSpec.line = '12';
failingSpec.error = 'Boooooo!!!';
failedStep = new angular.scenario.ObjectModel.Step('failing step');
failedStep.status = 'failure';
failingSpec.steps.push(failedStep);
tc = new Testacular(new MockSocket(), {});

registerResultListeners(model, tc);
});

it('should update number of tests as it sees them', function() {
spyOn(tc, 'info');

model.emit('SpecBegin');
expect(tc.info).toHaveBeenCalledWith({total: 1});

