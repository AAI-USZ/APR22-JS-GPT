var util = require('util');
var fs = require('fs');
var path = require('path');
var events = require('events');
var Q = require('q');
var tmp = require('tmp');
var mkdirp = require('mkdirp');
var config = require('../config');
var createError = require('../util/createError');

var Resolver = function (source, options) {
options = options || {};

this._source = source;
this._target = options.target || '*';
this._name = options.name;
