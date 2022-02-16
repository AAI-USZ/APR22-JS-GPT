str = this._prefix(err) + ' ' + err.message + '\n';
str = this._prefix(log) + ' ' + log.message + '\n';
StandardRenderer.prototype._prefix = function (log) {
