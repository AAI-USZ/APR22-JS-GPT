var Emitter = require('events').EventEmitter;
var mout = require('mout');
var Project = require('../core/Project');
var cli = require('../util/cli');
var help = require('./help');
var defaultConfig = require('../config');

function install(endpoints, options, config) {
var project;
var emitter = new Emitter();

options = options || {};
config = mout.object.deepMixIn(config, defaultConfig);


if (endpoints && !endpoints.length) {
endpoints = null;
}

project = new Project(config);
project.install(endpoints, options)
.then(function (installed) {
emitter.emit('end', installed);
}, function (error) {
emitter.emit('error', error);
}, function (notification) {
emitter.emit('notification', notification);
});

emitter.name = 'install';

return emitter;
}



install.line = function (argv) {
var options = install.options(argv);

if (options.help) {
