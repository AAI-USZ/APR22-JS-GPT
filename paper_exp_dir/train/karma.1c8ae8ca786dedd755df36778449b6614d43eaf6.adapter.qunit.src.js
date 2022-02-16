var createQUnitStartFn = function (tc) {
return function (runner) {
(function (tc, runner) {
var totalNumberOfTest = 0;
var timer = null;
var testResult = {};

runner.done(function () {
tc.info({ total: totalNumberOfTest });
tc.complete();
