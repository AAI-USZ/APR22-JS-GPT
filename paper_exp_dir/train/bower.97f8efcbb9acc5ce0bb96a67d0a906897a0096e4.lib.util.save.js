







var path   = require('path');
var fs     = require('fs');
var _      = require('lodash');

var config = require('../core/config');

function save (eventType, modifier, emitter, manager, paths) {

manager.on(eventType, manager.on('loadJSON', function () {
if (!this.json) return emitter.emit('error', new Error('Please define a ' + config.json));

var pkgs = paths.map(function (path) {
path = path.split('#')[0];

return _.find(Object.keys(this.dependencies), function (key) {
var dep = this.dependencies[key][0];

return dep.name == path
|| (dep.url && dep.url == path)
