var path = require('path');
var optimist = require('optimist');
var helper = require('./helper');
var constant = require('./constants');


var processArgs = function(argv, options) {

if (argv.help) {
console.log(optimist.help());
process.exit(0);
}

if (argv.version) {
console.log('Karma version: ' + constant.VERSION);
process.exit(0);
}


Object.getOwnPropertyNames(argv).forEach(function(name) {
if (name !== '_' && name !== '$0') {
options[helper.dashToCamel(name)] = argv[name];
}
});

if (helper.isString(options.autoWatch)) {
options.autoWatch = options.autoWatch === 'true';
}

if (helper.isString(options.colors)) {
options.colors = options.colors === 'true';
}

if (helper.isString(options.logLevel)) {
options.logLevel = constant['LOG_' + options.logLevel.toUpperCase()] || constant.LOG_DISABLE;
}

if (helper.isString(options.singleRun)) {
options.singleRun = options.singleRun === 'true';
}

if (helper.isString(options.browsers)) {
options.browsers = options.browsers.split(',');
}

if (options.reportSlowerThan === false) {
options.reportSlowerThan = 0;
}

if (helper.isString(options.reporters)) {
options.reporters = options.reporters.split(',');
}

if (helper.isString(options.removedFiles)) {
options.removedFiles = options.removedFiles.split(',');
}

if (helper.isString(options.addedFiles)) {
options.addedFiles = options.addedFiles.split(',');
}

if (helper.isString(options.changedFiles)) {
options.changedFiles = options.changedFiles.split(',');
}

if (helper.isString(options.refresh)) {
options.refresh = options.refresh === 'true';
}

options.configFile = path.resolve(argv._.shift() || 'karma.conf.js');

return options;
};

var parseClientArgs = function(argv) {

