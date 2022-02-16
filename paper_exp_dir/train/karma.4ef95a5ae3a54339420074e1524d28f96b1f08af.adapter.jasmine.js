
var SimpleReporter = function(sj, failedIds) {

this.reportRunnerStarting = function(runner) {
var count = runner.specs().length;
sj.info('Running ' + count + ' specs...');
};

this.reportRunnerResults = function(runner) {
sj.complete();
