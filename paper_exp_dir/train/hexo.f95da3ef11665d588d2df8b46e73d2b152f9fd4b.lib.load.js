var async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
_ = require('lodash'),
util = require('./util'),
file = util.file2,
yfm = util.yfm,
extend = require('./extend'),
generators = extend.generator.list(),
process = require('./process'),
renderFn = require('./render'),
render = renderFn.render,
renderFile = renderFn.renderFile,
