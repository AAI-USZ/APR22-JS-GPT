














var events     = require('events');
var async      = require('async');
var path       = require('path');
var glob       = require('glob');
var fs         = require('fs');

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
this.json    = JSON.parse(json);
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

this.once('resolveLocal', function () {
if (this.endpoints.length) {
this.once('resolveEndpoints', resolved).resolveEndpoints();
} else {
this.once('resolveFromJson', resolved).resolveFromJson();
}
}).resolveLocal();

return this;
};

Manager.prototype.resolveLocal = function () {
glob('./' + config.directory + '/*', function (err, dirs) {
if (err) return this.emit('error', err);
dirs.forEach(function (dir) {
var name = path.basename(dir);
var pkg = new Package(name, dir, this);
this.dependencies[name] = [];
this.dependencies[name].push(pkg);
pkg.on('error', function (err, origin) {
this.errors.push({ pkg: origin, error: err });
}.bind(this));
}.bind(this));
this.emit('resolveLocal');
}.bind(this));

