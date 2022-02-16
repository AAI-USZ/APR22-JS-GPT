if (!window.console || !window.console.log) {
window.console = {
log: function() {}
};
}


var SimpleReporter = function() {

this.reportRunnerStarting = function(runner) {
var count = runner.specs().length;
