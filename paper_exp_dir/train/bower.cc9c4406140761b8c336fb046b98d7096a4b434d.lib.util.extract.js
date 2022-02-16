var path = require('path');
var fs = require('graceful-fs');
var zlib = require('zlib');
var unzip = require('unzip');
var tar = require('tar');
var Q = require('q');
var mout = require('mout');
var junk = require('junk');
var createError = require('./createError');



zlib.Z_DEFAULT_CHUNK = 1024 * 8;

var extractors;
var extractorTypes;

extractors = {
'.zip': extractZip,
'.tar': extractTar,
'.tar.gz': extractTarGz,
'.tgz': extractTarGz,
'.gz': extractGz,
'application/zip': extractZip,
'application/x-tar': extractTar,
'application/x-tgz': extractTarGz,
'application/x-gzip': extractGz
};

extractorTypes = Object.keys(extractors);

function extractZip(archive, dst) {
var deferred = Q.defer();

fs.createReadStream(archive)
.on('error', deferred.reject)
.pipe(unzip.Extract({
path: dst,
follow: false,
filter: filterSymlinks
}))
.on('error', deferred.reject)
.on('close', deferred.resolve.bind(deferred, dst));

return deferred.promise;
}

function extractTar(archive, dst) {
var deferred = Q.defer();

fs.createReadStream(archive)
.on('error', deferred.reject)
.pipe(tar.Extract({
path: dst,
follow: false,
filter: filterSymlinks
}))
.on('error', deferred.reject)
.on('close', deferred.resolve.bind(deferred, dst));

return deferred.promise;
}

function extractTarGz(archive, dst) {
var deferred = Q.defer();

fs.createReadStream(archive)
.on('error', deferred.reject)
.pipe(zlib.createGunzip())
.on('error', deferred.reject)
.pipe(tar.Extract({
path: dst,
follow: false,
filter: filterSymlinks
}))
.on('error', deferred.reject)
.on('close', deferred.resolve.bind(deferred, dst));

return deferred.promise;
}

function extractGz(archive, dst) {
var deferred = Q.defer();

fs.createReadStream(archive)
.on('error', deferred.reject)
.pipe(zlib.createGunzip())
.on('error', deferred.reject)
.pipe(fs.createWriteStream(dst))
.on('error', deferred.reject)
.on('close', deferred.resolve.bind(deferred, dst));

return deferred.promise;
}

function filterSymlinks(entry) {
return entry.type !== 'SymbolicLink';
}

function getExtractor(archive) {


archive = archive.toLowerCase();

var type = mout.array.find(extractorTypes, function (type) {
return mout.string.endsWith(archive, type);
});

return type ? extractors[type] : null;
}

function isSingleDir(dir) {
return Q.nfcall(fs.readdir, dir)
.then(function (files) {
var singleDir;



files = files.filter(junk.isnt);

if (files.length !== 1) {
return false;
}

singleDir = path.join(dir, files[0]);

return Q.nfcall(fs.stat, singleDir)
.then(function (stat) {
return stat.isDirectory() ? singleDir : false;
});
});
}

function moveSingleDirContents(dir) {
var destDir = path.dirname(dir);

return Q.nfcall(fs.readdir, dir)
.then(function (files) {
var promises;

promises = files.map(function (file) {
var src = path.join(dir, file);
var dst = path.join(destDir, file);

return Q.nfcall(fs.rename, src, dst);
});

return Q.all(promises);
})
.then(function () {
return Q.nfcall(fs.rmdir, dir);
});
}



function canExtract(src, mimeType) {
if (mimeType && mimeType !== 'application/octet-stream') {
return !!getExtractor(mimeType);
}

return !!getExtractor(src);
}




function extract(src, dst, opts) {
var extractor;
var promise;
