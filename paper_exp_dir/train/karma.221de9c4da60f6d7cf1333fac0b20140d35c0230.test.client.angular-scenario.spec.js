

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
