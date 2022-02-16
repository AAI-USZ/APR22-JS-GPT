












var Emitter = require('events').EventEmitter;
var nopt    = require('nopt');
var fs      = require('fs');
var path    = require('path');

var Manager = require('../core/manager');
var config  = require('../core/config');
var source  = require('../core/source');
var save    = require('../util/save');
var help    = require('./help');

var optionTypes = { help: Boolean, save: Boolean, force: Boolean };
var shorthand   = { 'h': ['--help'], 'S': ['--save'], 'f': ['--force'] };

module.exports = function (paths, options) {
var emitter = new Emitter;
var manager = new Manager(paths, { force: options && options.force });

if (options && options.save) save(manager, paths);

manager
.on('data', emitter.emit.bind(emitter, 'data'))
.on('error', emitter.emit.bind(emitter, 'error'))
.on('resolve', emitter.emit.bind(emitter, 'end', null))
.resolve();

return emitter;
};

module.exports.line = function (argv) {
var options = nopt(optionTypes, shorthand, argv);
var paths   = options.argv.remain.slice(1);

if (options.help) return help('install');
return module.exports(paths, options);
};

module.exports.completion = function (opts, cb) {
var cache = path.join(config.completion, 'install.json');
var done = function done(err, results) {
if (err) return cb(err);
var names = results.map(function (pkg) {
return pkg.name;
});

return cb(null, names);
};

