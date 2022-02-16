

var async = require('async'),
fs = require('graceful-fs'),
_ = require('lodash'),
extend = require('./extend'),
processor = extend.processor.list(),
processorLength = processor.length,
util = require('./util'),
file = util.file2,
