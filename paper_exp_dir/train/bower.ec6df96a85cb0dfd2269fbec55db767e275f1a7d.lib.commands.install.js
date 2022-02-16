







var Emitter = require('events').EventEmitter;
var nopt    = require('nopt');
var fs      = require('fs');
var path    = require('path');

var Manager = require('../core/manager');
var config  = require('../core/config');
var source  = require('../core/source');
var save    = require('../util/save');
var help    = require('./help');

var optionTypes = { help: Boolean, save: Boolean, 'save-dev': Boolean, force: Boolean, 'force-latest': Boolean, production: Boolean };
var shorthand   = { 'h': ['--help'], 'S': ['--save'], 'D': ['--save-dev'], 'f': ['--force'], 'F': ['--force-latest'], 'p': ['--production'] };

module.exports = function (paths, options) {
options = options || {};

var emitter = new Emitter;
var manager = new Manager(paths, {
force: options.force,
forceLatest: options['force-latest'],
production: options.production
});

manager
.on('data', emitter.emit.bind(emitter, 'data'))
.on('warn', emitter.emit.bind(emitter, 'warn'))
.on('error', emitter.emit.bind(emitter, 'error'))
.on('resolve', function (resolved) {

if (resolved && (options.save || options['save-dev'])) {
save(manager, paths, !options.save, emitter.emit.bind(emitter, 'end'));
} else {
emitter.emit('end');
}
})
