require('colors');
var mout = require('mout');
var template = require('../util/template');

var wideCommands = ['install', 'update'];

function StandardRenderer(command, config) {
this._sizes = {
id: 10,
label: 23,
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

if (wideCommands.indexOf(command) === -1) {
this._compact = true;
} else {
this._compact = process.stdout.columns < 120;
}
}

StandardRenderer.prototype.end = function (data) {
var method = '_' + this._command;

if (this[method]) {
this[method](data);
}
};

StandardRenderer.prototype.error = function (err) {
var str;

err.id = err.code || 'error';
err.level = 'error';



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
template('std/update-notice.std', data)
.then(function (str) {
this._write(process.stderr, str);
}.bind(this), this.error.bind(this));
};



StandardRenderer.prototype._install = function (installed) {

};

StandardRenderer.prototype._update = function (updated) {

};

StandardRenderer.prototype._help = function (data) {
var that = this;

if (!data.command) {
template('std/help.std', data)
.then(function (str) {
that._write(process.stdout, str);
}, this.error.bind(this));
} else {

template('std/help-' + data.command + '.std', data)
.then(function (str) {
that._write(process.stdout, str);
}, function (err) {


if (err.code !== 'ENOENT') {
return err;
}



return template('std/help-generic.std', data)
.then(function (str) {
that._write(process.stdout, str);
}, that.error.bind(that));
});
}
};



StandardRenderer.prototype._genericLog = function (log) {
var stream;
var str;

if (log.level === 'warn') {
stream = process.stderr;
} else {
stream = process.stdout;
}

this._write(stream, 'bower ' + str);
};

StandardRenderer.prototype._mutualLog = function (log) {
log.id = 'conflict';
this._genericLog(log);
};

StandardRenderer.prototype._checkoutLog = function (log) {
if (this._compact) {
log.message = log.origin + '#' + log.message;
}

this._genericLog(log);
};



StandardRenderer.prototype._guessOrigin = function (log) {
if (log.data.endpoint) {
log.origin = log.data.endpoint.name || (log.data.registry && log.data.endpoint.source);
}

if (!log.origin) {
if (log.data.resolver) {
log.origin = log.data.resolver.name;
}
else if (log.data.package) {
log.origin = log.data.package;
}
}
};

