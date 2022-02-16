var chalk = require('chalk');
var path = require('path');
var mout = require('mout');
var archy = require('archy');
var Q = require('q');
var stringifyObject = require('stringify-object');
var os = require('os');
var pkg = require(path.join(__dirname, '../..', 'package.json'));
var template = require('../util/template');

function StandardRenderer(command, config) {
this._sizes = {
id: 13,
label: 20,
sumup: 5
};
this._colors = {
warn: chalk.yellow,
error: chalk.red,
conflict: chalk.magenta,
debug: chalk.gray,
default: chalk.cyan
};

this._command = command;
this._config = config;

if (this.constructor._wideCommands.indexOf(command) === -1) {
this._compact = true;
} else {
this._compact = process.stdout.columns < 120;
}

var exitOnPipeError = function (err) {
if (err.code === 'EPIPE') {
process.exit(0);
}
};


process.stdout.on('error', exitOnPipeError);
process.stderr.on('error', exitOnPipeError);
