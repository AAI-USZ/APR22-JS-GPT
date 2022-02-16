'use strict';

var fs = require('hexo-fs');
var pathFn = require('path');
var Promise = require('bluebird');
var prettyHrtime = require('pretty-hrtime');
var chalk = require('chalk');
var tildify = require('tildify');
var hash = require('../../hash');
var Transform = require('stream').Transform;
var _ = require('lodash');

var join = pathFn.join;

function generateConsole(args) {
var force = args.f || args.force;
var route = this.route;
var publicDir = this.public_dir;
var log = this.log;
var self = this;
var start = process.hrtime();
var Cache = this.model('Cache');
var generatingFiles = {};

function generateFile(path) {

if (generatingFiles[path]) return Promise.resolve();


generatingFiles[path] = true;

var dest = join(publicDir, path);

return fs.exists(dest).then(function(exist) {
if (force || !exist) return writeFile(path, true);
if (route.isModified(path)) return writeFile(path);
}).finally(function() {

generatingFiles[path] = false;
});
}

