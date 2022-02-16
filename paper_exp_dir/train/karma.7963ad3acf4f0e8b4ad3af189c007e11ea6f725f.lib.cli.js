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
