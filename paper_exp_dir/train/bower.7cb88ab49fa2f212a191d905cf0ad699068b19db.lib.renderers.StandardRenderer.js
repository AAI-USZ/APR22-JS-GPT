var chalk = require('chalk');
var path = require('path');
var mout = require('mout');
var archy = require('archy');
var Q = require('q');
var stringifyObject = require('stringify-object');
var os = require('os');
var semverUtils = require('semver-utils');
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
var inquirer = require('inquirer');
inquirer.prompt(prompts, deferred.resolve);

return deferred.promise;
};



StandardRenderer.prototype._help = function (data) {
var str;
var that = this;
var specific;

if (!data.command) {
str = template.render('std/help.std', data);
that._write(process.stdout, str);
} else {

specific = 'std/help-' + data.command.replace(/\s+/g, '/') + '.std';

if (template.exists(specific)) {
str = template.render(specific, data);
} else {
str =  template.render('std/help-generic.std', data);
}

that._write(process.stdout, str);
}
};

StandardRenderer.prototype._install = function (packages) {
var str = '';

mout.object.forOwn(packages, function (pkg) {
var cliTree;


mout.object.forOwn(pkg.dependencies, function (dependency) {
dependency.dependencies = {};
});

pkg.canonicalDir = path.relative(this._config.cwd, pkg.canonicalDir);

pkg.root = true;

cliTree = this._tree2archy(pkg);
str += '\n' + archy(cliTree);
}, this);

if (str) {
this._write(process.stdout, str);
}
};

StandardRenderer.prototype._update = function (packages) {
this._install(packages);
};

StandardRenderer.prototype._list = function (tree) {
var cliTree;

if (tree.pkgMeta) {
tree.root = true;
cliTree = archy(this._tree2archy(tree));
} else {
cliTree = stringifyObject(tree, { indent: '  ' }).replace(/[{}]/g, '') + '\n';
}

this._write(process.stdout, cliTree);
};

StandardRenderer.prototype._search = function (results) {
var str = template.render('std/search-results.std', results);
this._write(process.stdout, str);
};

StandardRenderer.prototype._info = function (data) {
var str = '';
var pkgMeta = data;
var includeVersions = false;



if (typeof data === 'object' && data.versions) {
pkgMeta = data.latest;
includeVersions = true;
}


if (pkgMeta != null) {
str += '\n' + this._highlightJson(pkgMeta) + '\n';
}


if (includeVersions) {
data.hidePreReleases = false;
data.numPreReleases = 0;

if (!this._config.verbose) {
data.versions = mout.array.filter(data.versions, function(version) {
version = semverUtils.parse(version);
if (!version.release && !version.build) {
return true;
}
data.numPreReleases++;
});
data.hidePreReleases = !!data.numPreReleases;
}
str += '\n' + template.render('std/info.std', data);
