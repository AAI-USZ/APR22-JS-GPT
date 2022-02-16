














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
this.prune();
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
this.once('loadJSON', function () {
glob('./' + this.opts.directory + '/*', function (err, dirs) {
if (err) return this.emit('error', err);
dirs.forEach(function (dir) {
var name = path.basename(dir);
this.dependencies[name] = [];
this.dependencies[name].push(new Package(name, dir, this));
}.bind(this));
this.emit('resolveLocal');
