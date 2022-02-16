

var async = require('async'),
pathFn = require('path'),
fs = require('graceful-fs'),
_ = require('lodash'),
util = require('../util'),
file = util.file2,
yfm = util.yfm;

var cache = {};
