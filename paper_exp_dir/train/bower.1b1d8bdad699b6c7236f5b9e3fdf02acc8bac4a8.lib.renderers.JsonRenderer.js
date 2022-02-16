var chalk = require('chalk');
var Q = require('q');
var promptly = require('promptly');
var createError = require('../util/createError');

function JsonRenderer() {
this._nrLogs = 0;
}

JsonRenderer.prototype.end = function (data) {
if (this._nrLogs) {
process.stderr.write(']\n');
}

if (data) {
process.stdout.write(this._stringify(data) + '\n');
}
};

JsonRenderer.prototype.error = function (err) {
var message = err.message;
var stack;

err.id = err.code || 'error';
err.level = 'error';
err.data = err.data || {};



delete err.message;
err.message = message;


stack = err.fstream_stack || err.stack || 'N/A';
err.stacktrace = (Array.isArray(stack) ? stack.join('\n') : stack);

this.log(err);
this.end();
};

JsonRenderer.prototype.log = function (log) {
if (!this._nrLogs) {
process.stderr.write('[');
