














var Package    = require('./package');
var UnitWork   = require('./unit_work');
var config     = require('./config');
var prune      = require('../util/prune');
var events     = require('events');
var async      = require('async');
var path       = require('path');
var glob       = require('glob');
var fs         = require('fs');

var fileExists = require('../util/file-exists');






var Manager = function (endpoints, opts) {
this.dependencies = {};
this.cwd          = process.cwd();
this.endpoints    = endpoints || [];
this.unitWork     = new UnitWork;
this.opts         = opts || {};
this.errors       = {};
};

Manager.prototype = Object.create(events.EventEmitter.prototype);
Manager.prototype.constructor = Manager;

Manager.prototype.loadJSON = function () {
var json = path.join(this.cwd, config.json);
fileExists(json, function (exists) {
if (!exists) {
