














var Package  = require('./package');
var UnitWork = require('./unit_work');
var config   = require('./config');
var prune    = require('../util/prune');
var events   = require('events');
var async    = require('async');
var path     = require('path');
var glob     = require('glob');
var fs       = require('fs');
var _        = require('lodash');






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




async.forEach(this.endpoints, function (endpoint, next) {
var name = path.basename(endpoint).replace(/(\.git)?(#.*)?$/, '');
var pkg  = new Package(name, endpoint, this);
this.dependencies[name] = this.dependencies[name] || [];
this.dependencies[name].push(pkg);
pkg.on('resolve', next).resolve();
}.bind(this), this.emit.bind(this, 'resolveEndpoints'));
};

Manager.prototype.loadJSON = function () {
