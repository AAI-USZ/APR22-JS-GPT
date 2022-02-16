var render = require('./render'),
util = require('./util'),
file = util.file,
yfm = util.yfm,
async = require('async'),
path = require('path'),
_ = require('underscore'),
extCache = {};

var config = exports.config = {};

