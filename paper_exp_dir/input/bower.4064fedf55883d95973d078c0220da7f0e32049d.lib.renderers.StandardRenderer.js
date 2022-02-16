var mout = require('mout');

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
this._compact = wideCommands.indexOf(command) === -1 ? true : process.stdout.columns < 120;
}

StandardRenderer.prototype.end = function (data) {
if (this[this._command]) {
this[this._command](data);
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
var name = '_' + mout.string.camelCase(notification.id) + 'Notification';

if (this[name]) {
this[name](notification);
} else {
this._genericNotification(notification);
}
};



StandardRenderer.prototype.install = function (installed) {

};

StandardRenderer.prototype.help = function (command) {

};

StandardRenderer.prototype.updateAvailable = function (update) {

};



