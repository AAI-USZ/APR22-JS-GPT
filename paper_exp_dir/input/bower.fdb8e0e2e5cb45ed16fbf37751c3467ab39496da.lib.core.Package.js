var util = require('util');
var fs = require('fs');
var path = require('path');
var events = require('events');
var mout = require('mout');
var Q = require('q');
var tmp = require('tmp');
var UnitOfWork = require('./UnitOfWork');
var config = require('./config');
var createPackage;
var createError = require('../util/createError');

var Package = function (endpoint, options) {
options = options || {};

this._endpoint = endpoint;
this._name = options.name;
this._range = options.range || '*';
this._unitOfWork = options.unitOfWork || new UnitOfWork();
