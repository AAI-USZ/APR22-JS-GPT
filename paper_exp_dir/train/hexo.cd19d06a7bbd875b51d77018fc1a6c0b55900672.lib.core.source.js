

var async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
_ = require('lodash'),
chokidar = require('chokidar'),
HexoError = require('../error'),
util = require('../util'),
file = util.file2;
