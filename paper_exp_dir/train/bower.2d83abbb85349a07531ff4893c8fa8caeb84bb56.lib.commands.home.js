var mout = require('mout');
var Logger = require('bower-logger');
var Project = require('../core/Project');
var open = require('open');
var cli = require('../util/cli');
var createError = require('../util/createError');
var defaultConfig = require('../config');

function home(name, config) {
var project;
var promise;
var logger = new Logger();

config = mout.object.deepFillIn(config || {}, defaultConfig);
project = new Project(config, logger);




if (!name) {
