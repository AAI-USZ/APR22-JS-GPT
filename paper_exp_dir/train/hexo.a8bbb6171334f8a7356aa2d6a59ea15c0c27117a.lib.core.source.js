

var async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
_ = require('lodash'),
HexoError = require('../error'),
util = require('../util'),
file = util.file2;

var rTmpFile = /[~%]$/;

var isRunning = false,
isReady = false,
processingFiles = {};

