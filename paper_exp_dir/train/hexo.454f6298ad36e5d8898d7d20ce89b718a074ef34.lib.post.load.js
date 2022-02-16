var async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
_ = require('lodash'),
watch = require('watch'),
util = require('../util'),
file = util.file2,
i18n = require('../i18n'),
HexoError = require('../error'),
process = require('./process');

var extend = hexo.extend,
generators = extend.generator.list();

