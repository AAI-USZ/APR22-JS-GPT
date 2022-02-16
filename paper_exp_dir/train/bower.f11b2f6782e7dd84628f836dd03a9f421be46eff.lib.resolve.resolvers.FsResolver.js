var util = require('util');
var fs = require('fs');
var path = require('path');
var mout = require('mout');
var Q = require('q');
var Resolver = require('../Resolver');
var copy = require('../../util/copy');
var extract = require('../../util/extract');
var createError = require('../../util/createError');

var FsResolver = function (source, options) {

source = path.resolve(source);
