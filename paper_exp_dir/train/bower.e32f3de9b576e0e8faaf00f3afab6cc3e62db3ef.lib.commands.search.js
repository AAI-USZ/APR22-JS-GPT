







var Emitter  = require('events').EventEmitter;
var nopt     = require('nopt');

var template = require('../util/template');
var source   = require('../core/source');
var install  = require('./install');
var help     = require('./help');

var optionTypes = { help: Boolean };
var shorthand   = { 'h': ['--help'] };

module.exports = function (name) {
var emitter = new Emitter;

var callback = function (err, results) {
if (err) return emitter.emit('error', err);

emitter.emit('packages', results);

if (results.length) {
template('search', {results: results})
.on('data', function (data) {
emitter.emit('data', data);
emitter.emit('end');
});
} else {
template('search-empty', {results: results})
.on('data', function (data) {
emitter.emit('data', data);
emitter.emit('end');
});
