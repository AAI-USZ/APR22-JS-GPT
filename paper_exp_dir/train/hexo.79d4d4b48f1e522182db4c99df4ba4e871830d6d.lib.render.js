

var renderer = require('./extend').renderer.list(),
rendererSync = require('./extend').rendererSync.list(),
helper = require('./extend').helper.list(),
async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
_ = require('lodash'),
util = require('./util'),
