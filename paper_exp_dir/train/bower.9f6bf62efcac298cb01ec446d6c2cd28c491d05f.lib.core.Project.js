var glob = require('glob');
var path = require('path');
var fs = require('fs');
var Q = require('q');
var mout = require('mout');
var bowerJson = require('bower-json');
var Manager = require('./Manager');
var defaultConfig = require('../config');
var createError = require('../util/createError');
var endpointParser = require('../util/endpointParser');

var Project = function (options) {
options = options || {};

this._options = options;
this._config = options.config || defaultConfig;
this._manager = new Manager(options);
};



Project.prototype.install = function (endpoints) {
var repairResult;
var that = this;


if (this._working) {
return Q.reject(createError('Already working', 'EWORKING'));
}
