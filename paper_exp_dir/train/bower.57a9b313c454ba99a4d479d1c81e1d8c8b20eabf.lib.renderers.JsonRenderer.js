function JsonRenderer() {
this._nrNotifications = 0;
}

JsonRenderer.prototype.end = function (data) {
if (this._nrNotifications) {
process.stderr.write(']\n');
}

if (data) {
process.stdout.write(this._stringify(data) + '\n');
}
};

JsonRenderer.prototype.error = function (err) {
err.id = err.code || 'error';
err.level = 'error';

this.notification(err);
this.end();
};

JsonRenderer.prototype.notification = function (notification) {
if (!this._nrNotifications) {
process.stderr.write('[');
} else {
process.stderr.write(', ');
}

process.stderr.write(this._stringify(notification));
this._nrNotifications++;
};

JsonRenderer.prototype.updateAvailable = function () {};



JsonRenderer.prototype._stringify = function (notification) {

var str = JSON.stringify(notification, null, '  ');

str = str.replace(/\x1B\[\d+m/g, '');

return str;
};

module.exports = JsonRenderer;
