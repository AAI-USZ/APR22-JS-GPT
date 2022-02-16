







var Emitter = require('events').EventEmitter;
var nopt    = require('nopt');
var fs      = require('fs');
var path    = require('path');

var Manager = require('../core/manager');
var config  = require('../core/config');
var source  = require('../core/source');
var save    = require('../util/save');
var help    = require('./help');

var optionTypes = { help: Boolean, save: Boolean, force: Boolean, 'force-latest': Boolean, production: Boolean };
var shorthand   = { 'h': ['--help'], 'S': ['--save'], 'f': ['--force'], 'F': ['--force-latest'], 'p': ['--production'] };

module.exports = function (paths, options) {
options = options || {};

var emitter = new Emitter;
var manager = new Manager(paths, {
force: options.force,
forceLatest: options['force-latest'],
production: options.production
});

if (options.save) save(manager);

manager
.on('data', emitter.emit.bind(emitter, 'data'))
