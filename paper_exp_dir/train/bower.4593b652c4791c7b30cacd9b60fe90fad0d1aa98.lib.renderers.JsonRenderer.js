function JsonRenderer() {
this._nrLogs = 0;
}

JsonRenderer.prototype.end = function (data) {
if (this._nrLogs) {
process.stderr.write(']\n');
}

if (data) {
process.stdout.write(this._stringify(data) + '\n');
}
};

JsonRenderer.prototype.error = function (err) {
var message = err.message;

err.id = err.code || 'error';
err.level = 'error';
err.data = err.data || {};



delete err.message;
err.message = message;

