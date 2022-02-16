var helper = require('../helper');


var MultiReporter = function() {
var reporters = this.reporters = [];

this.addAdapter = function(adapter) {
reporters.forEach(function(reporter) {
reporter.adapters.push(adapter);
});
};

this.removeAdapter = function(adapter) {
reporters.forEach(function(reporter) {
helper.arrayRemove(reporter.adapters, adapter);
});
};
};



module.exports = MultiReporter;
