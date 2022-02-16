var chalk = require('chalk');
var createError = require('../util/createError');

function JsonRenderer() {
this._nrLogs = 0;
}

JsonRenderer.prototype.end = function (data) {
if (this._nrLogs) {
process.stderr.write(']\n');
}
