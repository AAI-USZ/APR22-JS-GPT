var optimist = require('optimist');
var util = require('./util');
var constant = require('./constants');

var sharedConfig = function() {
optimist
.describe('port-runner', 'Port where the server is listening for runner.')
.describe('help', 'Print usage.')
.describe('version', 'Print current version.');
};


var processOptions = function(argv) {
