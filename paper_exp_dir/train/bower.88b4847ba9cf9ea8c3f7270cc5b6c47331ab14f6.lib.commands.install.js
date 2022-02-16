var EventEmitter = require('events').EventEmitter;
var mout = require('mout');
var Project = require('../core/Project');
var Logger = require('../core/Logger');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function install(endpoints, options, config) {
var project;
var emitter = new EventEmitter();
var logger = new Logger();
