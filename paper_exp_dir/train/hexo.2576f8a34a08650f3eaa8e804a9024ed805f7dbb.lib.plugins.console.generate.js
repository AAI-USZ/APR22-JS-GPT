'use strict';

var fs = require('hexo-fs');
var pathFn = require('path');
var Promise = require('bluebird');
var prettyHrtime = require('pretty-hrtime');
var chalk = require('chalk');
var _ = require('lodash');
var xxhash = require('xxhash');

var join = pathFn.join;

function generateConsole(args) {
var force = args.f || args.force;
var route = this.route;
var publicDir = this.public_dir;
var log = this.log;
var self = this;
var start = process.hrtime();
var Cache = this.model('Cache');

function generateFile(path) {
var dest = join(publicDir, path);

return fs.exists(dest).then(function(exist) {
if (!force && exist && !route.isModified(path)) return;

return checkHash(path).then(function(changed) {
if (force || changed || !exist) return writeFile(path);
});
});
}

function writeFile(path) {
var dest = join(publicDir, path);

return fs.ensureWriteStream(dest).then(function(stream) {
if (!stream) return false;

return pipeStream(route.get(path), stream).then(function() {
log.info('Generated: %s', chalk.magenta(path));
return true;
});
});
}

function checkHash(path) {
var data = route.get(path);
var id = 'public/' + path;
var hasher = new xxhash.Stream(0xCAFEBABE);

return pipeStream(data, hasher).then(function() {
var hash = hasher.read();
var cache = Cache.findById(id);

if (cache) {
if (cache.hash === hash) return;
} else {
cache = Cache.new({_id: id});
}

cache.hash = hash;
cache.modified = Date.now();
return cache;
});
