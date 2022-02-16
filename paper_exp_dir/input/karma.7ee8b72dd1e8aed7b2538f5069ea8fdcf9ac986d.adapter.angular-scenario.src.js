
var createNgScenarioStartFn = function(tc, scenarioSetupAndRun) {

angular.scenario.output('testacular', function(context, runner, model) {
registerResultListeners(model, tc);
});

return function(config) {
scenarioSetupAndRun();
};
};

var registerResultListeners = function(model, tc) {
var totalTests = 0;
