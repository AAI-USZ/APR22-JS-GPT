

var async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
_ = require('lodash'),
i18n = require('./i18n'),
HexoError = require('../error'),
util = require('../util'),
file = util.file2;

var rHiddenFile = /^_|\/_|[~%]$/;

var themeConfig = {},
themeLayout = {},
