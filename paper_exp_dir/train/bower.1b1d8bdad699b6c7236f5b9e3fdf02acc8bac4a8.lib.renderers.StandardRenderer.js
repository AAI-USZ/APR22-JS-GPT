var chalk = require('chalk');
var path = require('path');
var mout = require('mout');
var archy = require('archy');
var Q = require('q');
var stringifyObject = require('stringify-object');
var os = require('os');
var semverUtils = require('semver-utils');
var version = require('../version');
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
this._config = config || {};

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
}

StandardRenderer.prototype.end = function (data) {
var method = '_' + mout.string.camelCase(this._command);

if (this[method]) {
this[method](data);
}
};

StandardRenderer.prototype.error = function (err) {
var str;
var stack;

this._guessOrigin(err);

err.id = err.code || 'error';
err.level = 'error';

str = this._prefix(err) + ' ' + err.message.replace(/\r?\n/g, ' ').trim() + '\n';
this._write(process.stderr, 'bower ' + str);


if (err.details) {
str = chalk.yellow('\nAdditional error details:\n') + err.details.trim() + '\n';
this._write(process.stderr, str);
}



if (this._config.verbose || !err.code || err.errno) {
stack = err.fstream_stack || err.stack || 'N/A';
str = chalk.yellow('\nStack trace:\n');
str += (Array.isArray(stack) ? stack.join('\n') : stack) + '\n';
str += chalk.yellow('\nConsole trace:\n');

this._write(process.stderr, str);
this._write(process.stderr, new Error().stack);


this._write(process.stderr, chalk.yellow('\nSystem info:\n'));
