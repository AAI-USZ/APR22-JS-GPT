var EventEmitter = require('events').EventEmitter;
var path = require('path');
var mout = require('mout');
var Project = require('../core/Project');
var Logger = require('../core/Logger');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function list(options, config) {
var project;
var emitter = new EventEmitter();
var logger = new Logger();

options = options || {};
config = mout.object.deepMixIn(config || {}, defaultConfig);
project = new Project(config, logger);



project.getTree()
.spread(function (tree, flattened, extraneous) {
var ret;

if (options.paths) {
ret = paths(flattened);
} else {
ret = normal(tree, extraneous);
}

emitter.emit('end', ret);
}, function (error) {
emitter.emit('error', error);
});

emitter.json = !!options.paths;

return logger.pipe(emitter);
}

function paths(flattened) {
var ret = {};

mout.object.forOwn(flattened, function (pkg, name) {
if (!pkg.missing) {
