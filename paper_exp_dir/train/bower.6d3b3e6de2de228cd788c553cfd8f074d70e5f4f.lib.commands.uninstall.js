var EventEmitter = require('events').EventEmitter;
var mout = require('mout');
var Project = require('../core/Project');
var Logger = require('../core/Logger');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function uninstall(names, options, config) {
var project;
var emitter = new EventEmitter();
var logger = new Logger();

options = options || {};
config = mout.object.deepMixIn(config || {}, defaultConfig);
project = new Project(config, logger);
