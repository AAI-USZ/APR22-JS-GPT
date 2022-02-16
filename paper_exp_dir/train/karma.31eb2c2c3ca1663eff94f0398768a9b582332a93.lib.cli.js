var path = require('path');
var optimist = require('optimist');
var helper = require('./helper');
var constant = require('./constants');
var fs = require('fs');

var processArgs = function(argv, options, fs, path) {

if (argv.help) {
console.log(optimist.help());
process.exit(0);
}

if (argv.version) {
console.log('Karma version: ' + constant.VERSION);
process.exit(0);
}


Object.getOwnPropertyNames(argv).forEach(function(name) {
var argumentValue = argv[name];
if (name !== '_' && name !== '$0') {
if (Array.isArray(argumentValue)) {

argumentValue = argumentValue.pop();
}
options[helper.dashToCamel(name)] = argumentValue;
}
});

if (helper.isString(options.autoWatch)) {
