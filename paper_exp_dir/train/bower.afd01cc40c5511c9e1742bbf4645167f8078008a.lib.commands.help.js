var EventEmitter = require('events').EventEmitter;
var cli = require('../util/cli');

function help(name) {
var json;
var emitter = new EventEmitter();

if (!name) {
json = require('../../templates/json/help.json');
} else {
json = require('../../templates/json/help-' + name + '.json');
}
