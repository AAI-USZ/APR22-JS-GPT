var cardinal = require('cardinal');
var chalk = require('chalk');
var path = require('path');
var mout = require('mout');
var archy = require('archy');
var Q = require('q');
var inquirer = require('inquirer');
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
console.trace();


this._write(process.stderr, chalk.yellow('\nSystem info:\n'));
this._write(process.stderr, 'Bower version: ' + pkg.version + '\n');
this._write(process.stderr, 'Node version: ' + process.versions.node + '\n');
this._write(process.stderr, 'OS: ' + os.type() + ' ' + os.release() + ' ' + os.arch() + '\n');
}
};

StandardRenderer.prototype.log = function (log) {
var method = '_' + mout.string.camelCase(log.id) + 'Log';

this._guessOrigin(log);


if (this[method]) {
this[method](log);
} else {
this._genericLog(log);
}
};

StandardRenderer.prototype.prompt = function (prompts) {
var deferred;


if (!this._config.color) {
prompts.forEach(function (prompt) {
prompt.message = chalk.stripColor(prompt.message);
});
}


deferred = Q.defer();
inquirer.prompt(prompts, deferred.resolve);

return deferred.promise;
};

StandardRenderer.prototype.updateNotice = function (data) {
var str = template.render('std/update-notice.std', data);
this._write(process.stderr, str);
};

