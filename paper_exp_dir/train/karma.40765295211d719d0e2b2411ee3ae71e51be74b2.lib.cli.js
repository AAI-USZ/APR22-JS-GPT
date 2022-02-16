var optimist = require('optimist');
var util = require('./util');
var constant = require('./constants');
var path = require('path');


var processArgs = function(argv, options) {

if (argv.help) {
console.log(optimist.help());
process.exit(0);
}

if (argv.version) {
console.log('Testacular version: ' + constant.VERSION);
process.exit(0);
}


Object.getOwnPropertyNames(argv).forEach(function(name) {
if (name !== '_' && name !== '$0') {
options[util.dashToCamel(name)] = argv[name];
}
});

if (util.isString(options.autoWatch)) {
options.autoWatch = options.autoWatch === 'true';
}

if (util.isString(options.colors)) {
options.colors = options.colors === 'true';
}

if (util.isString(options.logLevel)) {
options.logLevel = constant['LOG_' + options.logLevel.toUpperCase()] || constant.LOG_DISABLE;
}

if (util.isString(options.singleRun)) {
options.singleRun = options.singleRun === 'true';
}

if (util.isString(options.browsers)) {
options.browsers = options.browsers.split(',');
}

if (util.isString(options.files)) {
options.files = options.files.split(',');
}

if (options.reportSlowerThan === false) {
options.reportSlowerThan = 0;
}

if (util.isString(options.reporters)) {
options.reporters = options.reporters.split(',');
}

options.configFile = path.resolve(argv._.shift() || 'testacular.conf.js');

return options;
