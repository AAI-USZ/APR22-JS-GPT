if (!window.console || !window.console.log) {
window.console = {
log: function() {}
};
}

window.dump = function() {
__slimjim__.info(Array.prototype.slice.call(arguments, 0));
};


var SimpleReporter = function() {

this.reportRunnerStarting = function(runner) {
var count = runner.specs().length;
__slimjim__.info('Running ' + count + ' specs...');
