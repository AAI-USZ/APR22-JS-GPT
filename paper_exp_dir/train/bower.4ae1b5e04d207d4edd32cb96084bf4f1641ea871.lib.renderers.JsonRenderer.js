var chalk = require('chalk');

function JsonRenderer() {
this._nrLogs = 0;
}

JsonRenderer.prototype.end = function (data) {
if (this._nrLogs) {
process.stderr.write(']\n');
}
