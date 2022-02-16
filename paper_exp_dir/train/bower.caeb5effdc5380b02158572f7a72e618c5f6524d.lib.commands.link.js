







var Emitter    = require('events').EventEmitter;
var nopt       = require('nopt');
var fs         = require('fs');
var path       = require('path');
var mkdirp     = require('mkdirp');
var rimraf     = require('rimraf');

var Manager    = require('../core/manager');
var help       = require('./help');
var template   = require('../util/template');
var config     = require('../core/config');
var isRepo     = require('../util/is-repo');

var optionTypes = { help: Boolean };
var shorthand   = { 'h': ['--help'] };

function linkSelf(emitter) {
var manager = new Manager;

manager
.on('error', emitter.emit.bind('error'))
.once('loadJSON', function () {
var destPath = path.join(config.links, manager.name);
var srcPath = process.cwd();

deleteLink(destPath, function (err) {
if (err) return emitter.emit('error', err);

createLink(srcPath, destPath, function (err) {
if (err) return emitter.emit('error', err);

