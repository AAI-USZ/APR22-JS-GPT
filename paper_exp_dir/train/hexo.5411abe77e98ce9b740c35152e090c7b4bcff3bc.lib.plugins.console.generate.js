'use strict';

var fs = require('hexo-fs');
var pathFn = require('path');
var Promise = require('bluebird');
var prettyHrtime = require('pretty-hrtime');
var chalk = require('chalk');
var _ = require('lodash');
var hash = require('../../hash');

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
if (!force && exist && !route.isModified(path)) return;


if (!exist) {
return writeFile(path, false);
}


return checkHash(path).then(function(changed) {
if (force || changed) return writeFile(path, true);
});
}).finally(function() {

generatingFiles[path] = false;
});
}

function writeFile(path, exist) {
var dest = join(publicDir, path);

return fs.ensureWriteStream(dest).then(function(stream) {
if (!stream) return false;

return pipeStream(route.get(path), stream).then(function() {
log.info('Generated: %s', chalk.magenta(path));

if (exist) return true;


return checkHash(path).thenReturn(true);
});
});
}

function checkHash(path) {
var fullPath = join(publicDir, path);

return Cache.compareFile(
'public/' + path,
function() {
var data = route.get(path);
var hasher = hash.stream();

return pipeStream(data, hasher).then(function() {
return hasher.read();
});
},

function() {
return fs.stat(fullPath);
}
).then(function(cache) {
return cache.type !== 'skip';
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

function generateFiles(files) {
var list = route.list();

return Promise.reduce(list, function(result, path) {
return generateFile(path).then(function(success) {
return success ? result + 1 : result;
});
}, 0);
}

function cleanFiles(files) {
var deleted = _.difference(files, route.list());

return Promise.map(deleted, deleteFile);
}

function firstGenerate() {

var interval = prettyHrtime(process.hrtime(start));
log.info('Files loaded in %s', chalk.cyan(interval));


start = process.hrtime();


return fs.exists(publicDir).then(function(exist) {
if (!exist) {

return fs.mkdirs(publicDir);
}


return fs.listDir(publicDir).map(function(path) {
return path.replace(/\\/g, '/');
});
}).then(function(files) {
files = files || [];

return Promise.all([
generateFiles(files),
cleanFiles(files)
]);
}).spread(function(count) {
var interval = prettyHrtime(process.hrtime(start));
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


function pipeStream(rs, ws) {
return new Promise(function(resolve, reject) {
rs.pipe(ws)
.on('error', reject)
.on('finish', resolve);
});
}

module.exports = generateConsole;
