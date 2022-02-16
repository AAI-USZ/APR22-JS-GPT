















var events     = require('events');
var async      = require('async');
var path       = require('path');
var glob       = require('glob');
var fs         = require('fs');
var _          = require('lodash');

var Package    = require('./package');
var UnitWork   = require('./unit_work');
var config     = require('./config');
var fileExists = require('../util/file-exists');
var template   = require('../util/template');
var prune      = require('../util/prune');






var Manager = function (endpoints, opts) {
this.dependencies = {};
this.cwd          = process.cwd();
this.endpoints    = endpoints || [];
this.unitWork     = new UnitWork;
this.opts         = opts || {};
this.errors       = [];
};

Manager.prototype = Object.create(events.EventEmitter.prototype);
Manager.prototype.constructor = Manager;

Manager.prototype.loadJSON = function () {
var json = path.join(this.cwd, config.json);
fileExists(json, function (exists) {
if (!exists) {

this.json = {
name: path.basename(this.cwd),
version: '0.0.0'
},
this.name = this.json.name;
this.version = this.json.version;
return this.emit('loadJSON');
}

fs.readFile(json, 'utf8', function (err, json) {
if (err) return this.emit('error', err);
try {
this.json    = JSON.parse(json);
} catch (e) {
return this.emit('error', new Error('There was an error while reading the ' + config.json));
}
this.name    = this.json.name;
this.version = this.json.version;
this.emit('loadJSON');
}.bind(this));
}.bind(this));

return this;
};

Manager.prototype.resolve = function () {
var resolved = function () {

if (this.errors.length) return this.reportErrors();

if (!this.prune()) return this.emit('resolve', false);

this.once('install', this.emit.bind(this, 'resolve', true)).install();
}.bind(this);

