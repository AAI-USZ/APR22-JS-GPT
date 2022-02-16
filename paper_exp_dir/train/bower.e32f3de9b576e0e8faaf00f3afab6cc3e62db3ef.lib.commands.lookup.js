







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

source.lookup(name, function (err, url) {
if (err) {
source.search(name, function (err, packages) {
if (packages.length) {
template('suggestions', { packages: packages, name: name })
.on('data', function (data) {
emitter.emit('data', data);
emitter.emit('end');
});
} else {
template('warning-missing', {name: name})
.on('data', function (data) {
