

var async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
chokidar = require('chokidar'),
_ = require('lodash'),
i18n = require('./i18n'),
HexoError = require('../error'),
util = require('../util'),
