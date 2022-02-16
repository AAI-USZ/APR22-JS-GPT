var mout = require('mout');
var Q = require('q');
var Project = require('../core/Project');
var Tracker = require('../util/analytics').Tracker;
var defaultConfig = require('../config');

function uninstall(logger, names, options, config) {
if (!names.length) {
return new Q();
}

var project;
var tracker;

