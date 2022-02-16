














var Package    = require('./package');
var UnitWork   = require('./unit_work');
var config     = require('./config');
var prune      = require('../util/prune');
var events     = require('events');
var async      = require('async');
var path       = require('path');
var glob       = require('glob');
var fs         = require('fs');
var _          = require('lodash');

var fileExists = require('../util/file-exists');






var Manager = function (endpoints, opts) {
this.dependencies = {};
this.cwd          = process.cwd();
this.endpoints    = endpoints || [];
this.unitWork     = new UnitWork;
this.opts         = opts || {};
};

Manager.prototype = Object.create(events.EventEmitter.prototype);
Manager.prototype.constructor = Manager;

Manager.prototype.resolve = function () {
var resolved = function () {

if (!this.prune()) return this.emit('resolve');
this.on('install', this.emit.bind(this, 'resolve'));
this.install();
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
this.dependencies[name] = [];
this.dependencies[name].push(new Package(name, dir, this));
}.bind(this));
this.emit('resolveLocal');
}.bind(this));
};

Manager.prototype.resolveEndpoints = function () {




var endpointNames = this.opts.endpointNames || {};

async.forEach(this.endpoints, function (endpoint, next) {
var name = endpointNames[endpoint];
var pkg  = new Package(name, endpoint, this);
this.dependencies[name] = this.dependencies[name] || [];
this.dependencies[name].push(pkg);
pkg.on('resolve', next).resolve();
}.bind(this), this.emit.bind(this, 'resolveEndpoints'));
};

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
this.name    = json.name;
this.version = json.version;
this.emit('loadJSON');
}.bind(this));
}.bind(this));
};

Manager.prototype.resolveFromJson = function () {





this.once('loadJSON', function () {
if (!this.json.dependencies) return this.emit('error', new Error('Could not find any dependencies'));

async.forEach(Object.keys(this.json.dependencies), function (name, next) {
var endpoint = this.json.dependencies[name];
var pkg      = new Package(name, endpoint, this);
this.dependencies[name] = this.dependencies[name] || [];
this.dependencies[name].push(pkg);
pkg.on('resolve', next).resolve();
}.bind(this), this.emit.bind(this, 'resolveFromJson'));
