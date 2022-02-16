var Emitter = require('events').EventEmitter;
var cli = require('../util/cli');

function help(name) {
var emitter = new Emitter();
var json;

if (!name) {
json = require('../../templates/json/help.json');
} else {
json = require('../../templates/json/help-' + name + '.json');
