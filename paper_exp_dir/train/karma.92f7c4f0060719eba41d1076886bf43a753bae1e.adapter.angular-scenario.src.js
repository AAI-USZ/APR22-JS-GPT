
var createNgScenarioStartFn = function(tc, scenarioSetupAndRun) {

angular.scenario.output('testacular', function(context, runner, model) {
registerResultListeners(model, tc);
});

return function(config) {
scenarioSetupAndRun({scenario_output: 'testacular'});
};
};

var registerResultListeners = function(model, tc) {
var totalTests = 0, testsCompleted = 0;

var createFailedSpecLog = function(spec) {
var failedStep = findFailedStep(spec.steps);
var specError = spec.line ? spec.line + ': ' + spec.error : spec.error;

return failedStep ? [failedStep.name, specError] : [specError];
};

var findFailedStep = function(steps) {
var stepCount = steps.length;
for(var i=0; i<stepCount; i++) {
var step = steps[i];
if (step.status === 'failure') {
