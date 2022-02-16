require('colors');
var path = require('path');
var mout = require('mout');
var archy = require('archy');
var stringifyObject = require('stringify-object');
var template = require('../util/template');

function StandardRenderer(command, config) {
this._sizes = {
id: 13,
label: 20,
sumup: 5
};
this._colors = {
warn: 'yellow',
error: 'red',
conflict: 'magenta',
'default': 'cyan'
};

this._command = command;
this._config = config;

if (this.constructor._wideCommands.indexOf(command) === -1) {
this._compact = true;
} else {
this._compact = process.stdout.columns < 120;
}
}

StandardRenderer.prototype.end = function (data) {
var method = '_' + mout.string.camelCase(this._command);

if (this[method]) {
this[method](data);
}
};

StandardRenderer.prototype.error = function (err) {
var str;

this._guessOrigin(err);

err.id = err.code || 'error';
err.level = 'error';

str = this._prefix(err) + ' ' + err.message.trim() + '\n';
this._write(process.stderr, 'bower ' + str);


if (err.details) {
str = '\nAdditional error details:\n'.yellow + err.details.trim() + '\n';
this._write(process.stderr, str);
}


