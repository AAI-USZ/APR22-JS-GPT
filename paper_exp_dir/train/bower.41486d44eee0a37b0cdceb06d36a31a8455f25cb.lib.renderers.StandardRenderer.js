require('colors');
var mout = require('mout');
var template = require('../util/template');

var wideCommands = ['install', 'update'];

function StandardRenderer(command, colorful) {
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
this._colorful = colorful == null ? true : colorful;

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

str = this._prefixNotification(err) + ' ' + err.message + '\n';


if (err.details) {
str += mout.string.trim(err.details) + '\n';
}


if (!err.skippable) {
str += '\n' + err.stack + '\n';
}

this._write(process.stderr, 'bower ' + str);
};

StandardRenderer.prototype.notification = function (notification) {
var method = '_' + mout.string.camelCase(notification.id) + 'Notification';

if (this[method]) {
this[method](notification);
} else {
this._genericNotification(notification);
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
