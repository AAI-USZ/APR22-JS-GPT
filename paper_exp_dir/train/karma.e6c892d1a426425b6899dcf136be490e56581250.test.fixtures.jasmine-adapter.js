if (!window.console || !window.console.log) {
window.console = {
log: function() {}
};
}


var SimpleReporter = function() {

this.reportRunnerStarting = function(runner) {
var count = runner.specs().length;
__slimjim__.info('Running ' + count + ' specs...');
};

this.reportRunnerResults = function(runner) {
__slimjim__.complete();
};

this.reportSuiteResults = function(suite) {
};

this.reportSpecStarting = function(spec) {
};

this.reportSpecResults = function(spec) {
