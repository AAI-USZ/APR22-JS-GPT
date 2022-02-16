var registerResultListeners = function(model, tc) {
var totalTests = 0, testsCompleted = 0;

var createFailedSpecLog = function(spec) {
var failedStep = findFailedStep(spec.steps);
var specError = spec.line ? spec.line + ': ' + spec.error.toString() : spec.error.toString();

return failedStep ? [failedStep.name, specError] : [specError];
};

var findFailedStep = function(steps) {
var stepCount = steps.length;
