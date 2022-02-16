var optimist = require('optimist');
var util = require('./util');
var constant = require('./constants');

var sharedConfig = function() {
optimist
.describe('port-runner', '<integer> Port where the server is listening for runner.')
.describe('help', 'Print usage.')
.describe('version', 'Print current version.');
};


var processOptions = function(argv) {
argv = optimist.parse(argv || process.argv);

if (argv.help) {
console.log(optimist.help());
process.exit(0);
}

if (argv.version) {
console.log('Testacular version: ' + constant.VERSION);
process.exit(0);
}


var options = {};
Object.getOwnPropertyNames(argv).forEach(function(name) {
if (name === '_' || name === '$0') return;
options[util.dashToCamel(name)] = argv[name];
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

