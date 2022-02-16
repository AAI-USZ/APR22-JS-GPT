







var Emitter  = require('events').EventEmitter;
var nopt     = require('nopt');
var readline = require('readline');

var template = require('../util/template');
var source   = require('../core/source');
var help     = require('./help');


var optionTypes = { help: Boolean };
var shorthand   = { 'h': ['--help'], '-s': ['--silent'] };

var register = function (name, url, emitter)  {
source.register(name, url, function (err) {
if (err) return emitter.emit('error', err);

template('register', {name: name, url: url})
.on('data', emitter.emit.bind(emitter, 'data'));
});
};

module.exports = function (name, url, options) {
