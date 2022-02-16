var chalk = require('chalk');
var Q = require('q');
var promptly = require('promptly');
var createError = require('../util/createError');

function JsonRenderer() {
this._nrLogs = 0;
}

JsonRenderer.prototype.end = function (data) {
if (this._nrLogs) {
