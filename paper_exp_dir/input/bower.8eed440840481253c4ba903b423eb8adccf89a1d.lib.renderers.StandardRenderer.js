require('colors');
var mout = require('mout');
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

str = this._prefix(err) + ' ' + err.message + '\n';


if (err.details) {
str += mout.string.trim(err.details) + '\n';
}



if (err.stack && (this._config.verbose || !err.code)) {
str += '\n' + err.stack + '\n';
}

this._write(process.stderr, 'bower ' + str);
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

StandardRenderer.prototype._cacheList = function (entries) {
entries.forEach(function (pkgMeta) {
this.log({
level: 'info',
id: 'cached-entry',
message: pkgMeta._source + (pkgMeta._release ? '#' + pkgMeta._release : ''),
data: {
name: pkgMeta.name,
version: pkgMeta._version || (pkgMeta._target === '*' ? '' : pkgMeta._target)

}
});
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

StandardRenderer.prototype._incompatibleLog = function (log) {
var str;
var templatePath;


log.data.picks.forEach(function (pick) {
pick.dependants = pick.dependants.map(function (dependant) {
var release = dependant.pkgMeta._release;
return dependant.endpoint.name + (release ? '#' + release : '');
}).join(', ');
});

templatePath = log.data.resolution ? 'std/conflict-resolved.std' : 'std/conflict.std';
str = template.render(templatePath, log.data);

this._write(process.stdout, '\n');
this._write(process.stdout, str);
this._write(process.stdout, '\n');
};

StandardRenderer.prototype._solvedLog = function (log) {
this._incompatibleLog(log);
};

StandardRenderer.prototype._cachedEntryLog = function (log) {
if (this._compact) {
log.message = log.origin;
}

this._genericLog(log);
};



StandardRenderer.prototype._guessOrigin = function (log) {
