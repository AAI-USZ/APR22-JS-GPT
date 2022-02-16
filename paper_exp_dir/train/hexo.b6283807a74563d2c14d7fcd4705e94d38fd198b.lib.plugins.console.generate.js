'use strict';

var fs = require('hexo-fs');
var pathFn = require('path');
var Promise = require('bluebird');
var prettyHrtime = require('pretty-hrtime');
var chalk = require('chalk');
var tildify = require('tildify');
var Transform = require('stream').Transform;
var PassThrough = require('stream').PassThrough;
var _ = require('lodash');
var util = require('hexo-util');

var join = pathFn.join;

function generateConsole(args) {
args = args || {};
var force = args.f || args.force;
var bail = args.b || args.bail;
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

function writeFile(path, force) {
var dest = join(publicDir, path);
var cacheId = 'public/' + path;
var dataStream = wrapDataStream(route.get(path), {bail});
var cacheStream = new CacheStream();
var hashStream = new util.HashStream();


return pipeStream(dataStream, cacheStream, hashStream).then(function() {
var cache = Cache.findById(cacheId);
var hash = hashStream.read().toString('hex');


if (!force && cache && cache.hash === hash) {
return;
}


return Cache.save({
_id: cacheId,
hash: hash
}).then(function() {

return fs.writeFile(dest, cacheStream.getCache());
}).then(function() {
log.info('Generated: %s', chalk.magenta(path));
return true;
});
}).finally(function() {

cacheStream.destroy();
});
}

function deleteFile(path) {
var dest = join(publicDir, path);

return fs.unlink(dest).then(function() {
log.info('Deleted: %s', chalk.magenta(path));
}, function(err) {

if (err.cause && err.cause.code === 'ENOENT') return;
throw err;
});
}

function wrapDataStream(dataStream, options) {
var bail = options && options.bail;


if (bail === true) {
return dataStream;
}


dataStream.on('error', function(err) {
log.error(err);
});

return dataStream.pipe(new PassThrough());
}

function firstGenerate() {

var interval = prettyHrtime(process.hrtime(start));
log.info('Files loaded in %s', chalk.cyan(interval));


start = process.hrtime();


return fs.stat(publicDir).then(function(stats) {
if (!stats.isDirectory()) {
throw new Error('%s is not a directory', chalk.magenta(tildify(publicDir)));
}
}).catch(function(err) {

if (err.cause && err.cause.code === 'ENOENT') {
return fs.mkdirs(publicDir);
}

throw err;
}).then(function() {
var routeList = route.list();
var publicFiles = Cache.filter(function(item) {
return item._id.substring(0, 7) === 'public/';
}).map(function(item) {
return item._id.substring(7);
});

return Promise.all([

Promise.map(routeList, generateFile),


Promise.filter(publicFiles, function(path) {
return !~routeList.indexOf(path);
}).map(deleteFile)
]);
}).spread(function(result) {
var interval = prettyHrtime(process.hrtime(start));
var count = result.filter(Boolean).length;

log.info('%d files generated in %s', count, chalk.cyan(interval));
});
}

if (args.w || args.watch) {
return this.watch().then(firstGenerate).then(function() {
log.info('Hexo is watching for file changes. Press Ctrl+C to exit.');


route.on('update', function(path) {
var modified = route.isModified(path);
if (!modified) return;

generateFile(path);
}).on('remove', function(path) {
deleteFile(path);
});
});
}

return this.load().then(firstGenerate).then(function() {
if (args.d || args.deploy) {
return self.call('deploy', args);
}
});
}


function pipeStream() {
var args = _.toArray(arguments);
var src = args.shift();

return new Promise(function(resolve, reject) {
var stream = src.on('error', reject);
var target;

while ((target = args.shift()) != null) {
stream = stream.pipe(target).on('error', reject);
}

stream.on('finish', resolve);
stream.on('end', resolve);
stream.on('close', resolve);
});
}

function CacheStream() {
Transform.call(this);

this._cache = [];
}

require('util').inherits(CacheStream, Transform);

CacheStream.prototype._transform = function(chunk, enc, callback) {
var buf = chunk instanceof Buffer ? chunk : Buffer.from(chunk, enc);

this._cache.push(buf);
this.push(buf);
callback();
};

CacheStream.prototype.destroy = function() {
this._cache.length = 0;
};

CacheStream.prototype.getCache = function() {
return Buffer.concat(this._cache);
};

module.exports = generateConsole;
