var mout = require('mout');

function StandardRenderer(colorful) {
this._sizes = {
id: 10,
label: 23,
sumup: 5
};
this._colors = {
warn: 'yellow',
error: 'red',
'default': 'cyan'
};

this._colorful = colorful == null ? true : colorful;
this._compact = process.stdout.columns < 120;
}

StandardRenderer.prototype.end = function () {};

StandardRenderer.prototype.error = function (err) {
var str;

err.id = err.code || 'error';
err.level = 'error';

str = this._prefixNotification(err) + ' ' + err.message + '\n';


if (err.details) {
str += mout.string.trim(err.details) + '\n';
}


str += '\n' + err.stack + '\n';

this._write(process.stderr, 'bower ' + str);
