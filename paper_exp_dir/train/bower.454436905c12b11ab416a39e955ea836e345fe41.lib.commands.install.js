var Emitter = require('events').EventEmitter;
var mout = require('mout');
var Project = require('../core/Project');
var cli = require('../util/cli');
var help = require('./help');
var defaultConfig = require('../config');

function install(endpoints, options, config) {
var project;
var emitter = new Emitter();

