







var Emitter  = require('events').EventEmitter;
var nopt     = require('nopt');

var template = require('../util/template');
var source   = require('../core/source');
var help     = require('./help');

var optionTypes = { help: Boolean };
var shorthand   = { 'h': ['--help'] };

module.exports = function (name) {
var emitter = new Emitter;

name && source.info(name, function (err, result) {
if (err) return emitter.emit('error', err);
emitter.emit('end', result);
});

return emitter;
};

module.exports.line = function (argv) {
var emitter  = new Emitter;
var options  = nopt(optionTypes, shorthand, argv);
var names    = options.argv.remain.slice(1);


