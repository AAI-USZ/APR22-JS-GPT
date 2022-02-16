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
options[util.dashToCamel(name)] = argv[name];
