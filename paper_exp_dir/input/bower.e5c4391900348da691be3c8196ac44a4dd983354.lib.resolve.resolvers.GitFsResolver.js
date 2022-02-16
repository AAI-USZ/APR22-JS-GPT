var util = require('util');
var Q = require('q');
var mout = require('mout');
var GitResolver = require('./GitResolver');
var copy = require('../../util/copy');
var cmd = require('../../util/cmd');
var path = require('path');

var GitFsResolver = function (source, options) {

