var render = require('./render'),
renderer = Object.keys(require('./extend').renderer.list()),
util = require('./util'),
file = util.file,
yfm = util.yfm,
partial = util.partial,
async = require('async'),
path = require('path'),
_ = require('underscore'),
cache = {};

