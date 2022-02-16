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
const dataStream = wrapDataStream(route.get(path), {bail});
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

function wrapDataStream(dataStream, options) {
const bail = options && options.bail;


if (bail === true) {
return dataStream;
}


dataStream.on('error', err => {
log.error(err);
});

return dataStream.pipe(new PassThrough());
}

function firstGenerate() {

const interval = prettyHrtime(process.hrtime(start));
log.info('Files loaded in %s', cyan(interval));


start = process.hrtime();


return fs.stat(publicDir).then(stats => {
if (!stats.isDirectory()) {
throw new Error('%s is not a directory', magenta(tildify(publicDir)));
}
}).catch(err => {

if (err.cause && err.cause.code === 'ENOENT') {
return fs.mkdirs(publicDir);
}

throw err;
}).then(() => {
const task = (fn, path) => () => fn(path);
const doTask = fn => fn();
const routeList = route.list();
const publicFiles = Cache.filter(item => item._id.startsWith('public/')).map(item => item._id.substring(7));
const tasks = publicFiles.filter(path => !routeList.includes(path))

.map(path => task(deleteFile, path))

.concat(routeList.map(path => task(generateFile, path)));

return Promise.all(Promise.map(tasks, doTask, { concurrency: parseFloat(concurrency || 'Infinity') }));
}).then(result => {
const interval = prettyHrtime(process.hrtime(start));
const count = result.filter(Boolean).length;

log.info('%d files generated in %s', count, cyan(interval));
});
}

if (args.w || args.watch) {
return this.watch().then(firstGenerate).then(() => {
log.info('Hexo is watching for file changes. Press Ctrl+C to exit.');


route.on('update', path => {
const modified = route.isModified(path);
if (!modified) return;

generateFile(path);
}).on('remove', path => {
deleteFile(path);
});
});
}

return this.load().then(firstGenerate).then(() => {
if (args.d || args.deploy) {
return this.call('deploy', args);
}
});
}


function pipeStream(...args) {
const src = args.shift();

return new Promise((resolve, reject) => {
let stream = src.on('error', reject);
let target;

while ((target = args.shift()) != null) {
stream = stream.pipe(target).on('error', reject);
}

stream.on('finish', resolve);
stream.on('end', resolve);
stream.on('close', resolve);
});
}

module.exports = generateConsole;
