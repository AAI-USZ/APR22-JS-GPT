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

str = this._prefix(err) + ' ' + err.message.replace(/\r?\n/g, ' ').trim() + '\n';
this._write(process.stderr, 'bower ' + str);


if (err.details) {
str = '\nAdditional error details:\n'.yellow + err.details.trim() + '\n';
this._write(process.stderr, str);
}



if (this._config.verbose || !err.code || err.errno) {


str = '\nStack trace:\n'.yellow;
str += err.stack + '\n';
str += '\nConsole trace:\n'.yellow;

this._write(process.stderr, str);
console.trace();
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

StandardRenderer.prototype.updateNotice = function (data) {
var str = template.render('std/update-notice.std', data);
this._write(process.stderr, str);
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

tree.root = true;
cliTree = this._tree2archy(tree);

this._write(process.stdout, archy(cliTree));
};

StandardRenderer.prototype._search = function (results) {
var str = template.render('std/search-results.std', results);
this._write(process.stdout, str);
};

StandardRenderer.prototype._info = function (data) {
var str;



if (typeof data === 'object' && data.name && data.versions) {
str = template.render('std/info.std', data);
} else {

str = '\n' + stringifyObject(data, { indent: '  ' }) + '\n';
}

this._write(process.stdout, str);
};

StandardRenderer.prototype._lookup = function (data) {
var str = template.render('std/lookup.std', data);

this._write(process.stdout, str);
};

StandardRenderer.prototype._link = function (data) {
this._sizes.id = 4;

this.log({
id: 'link',
level: 'info',
message: data.dst + ' > ' + data.src
});
};

StandardRenderer.prototype._cacheList = function (entries) {
entries.forEach(function (entry) {
var pkgMeta = entry.pkgMeta;
var version = pkgMeta.version || pkgMeta._target;
this._write(process.stdout, pkgMeta.name + '=' + pkgMeta._source + '#' + version + '\n');
}, this);
};



StandardRenderer.prototype._genericLog = function (log) {
var stream;
var str;

if (log.level === 'warn') {
stream = process.stderr;
} else {
stream = process.stdout;
}

str = this._prefix(log) + ' ' + log.message + '\n';
this._write(stream, 'bower ' + str);
};

StandardRenderer.prototype._checkoutLog = function (log) {
if (this._compact) {
log.message = log.origin.split('#')[0] + '#' + log.message;
}

this._genericLog(log);
};

StandardRenderer.prototype._progressLog = function (log) {
if (this._compact) {
log.message = log.origin + ' ' + log.message;
}

this._genericLog(log);
};

StandardRenderer.prototype._incompatibleLog = function (log) {
var str;
var templatePath;
