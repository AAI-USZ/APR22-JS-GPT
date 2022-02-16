'use strict';

const fs = require('hexo-fs');
const { join } = require('path');
const Promise = require('bluebird');
const prettyHrtime = require('pretty-hrtime');
const { cyan, magenta } = require('chalk');
const tildify = require('tildify');
const { PassThrough } = require('stream');
const { CacheStream, HashStream } = require('hexo-util');

function generateConsole(args = {}) {
const force = args.f || args.force;
const bail = args.b || args.bail;
const concurrency = args.c || args.concurrency;
const { route, log } = this;
const publicDir = this.public_dir;
let start = process.hrtime();
const Cache = this.model('Cache');
const generatingFiles = {};

function generateFile(path) {

if (generatingFiles[path]) return Promise.resolve();


generatingFiles[path] = true;

const dest = join(publicDir, path);

return fs.exists(dest).then(exist => {
if (force || !exist) return writeFile(path, true);
if (route.isModified(path)) return writeFile(path);
}).finally(() => {

generatingFiles[path] = false;
});
}

function writeFile(path, force) {
const dest = join(publicDir, path);
const cacheId = `public/${path}`;
const dataStream = wrapDataStream(route.get(path), { bail });
const cacheStream = new CacheStream();
const hashStream = new HashStream();


return pipeStream(dataStream, cacheStream, hashStream).then(() => {
const cache = Cache.findById(cacheId);
const hash = hashStream.read().toString('hex');


if (!force && cache && cache.hash === hash) {
return;
}


return Cache.save({
_id: cacheId,
hash
}).then(() =>
fs.writeFile(dest, cacheStream.getCache())).then(() => {
log.info('Generated: %s', magenta(path));
return true;
});
}).finally(() => {

cacheStream.destroy();
});
}

function deleteFile(path) {
const dest = join(publicDir, path);

return fs.unlink(dest).then(() => {
log.info('Deleted: %s', magenta(path));
}, err => {

if (err.cause && err.cause.code === 'ENOENT') return;
throw err;
});
}

function wrapDataStream(dataStream, { bail }) {

if (bail === true) {
return dataStream;
}


dataStream.on('error', err => {
log.error(err);
