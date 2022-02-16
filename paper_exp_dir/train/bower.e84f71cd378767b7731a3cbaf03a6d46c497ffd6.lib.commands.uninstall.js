var mout = require('mout');
var Logger = require('bower-logger');
var Q = require('q');
var Project = require('../core/Project');
var cli = require('../util/cli');
var Tracker = require('../util/analytics').Tracker;
var defaultConfig = require('../config');

function uninstall(names, options, config) {
var project;
var tracker;
var logger = new Logger();

options = options || {};
config = mout.object.deepFillIn(config || {}, defaultConfig);
