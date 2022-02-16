var EventEmitter = require('events').EventEmitter;
var mout = require('mout');
var PackageRepository = require('../core/PackageRepository');
var Logger = require('../core/Logger');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function info(pkg, property, options, config) {
var repository;
var emitter = new EventEmitter();
var logger = new Logger();
