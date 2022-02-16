var mout = require('mout');
var Logger = require('bower-logger');
var Q = require('q');
var Project = require('../core/Project');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function uninstall(names, options, config) {
var project;
var logger = new Logger();

options = options || {};
