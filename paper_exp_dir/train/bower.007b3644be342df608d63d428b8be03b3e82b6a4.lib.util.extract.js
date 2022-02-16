var path = require('path');
var fs = require('fs');
var zlib = require('zlib');
var unzip = require('unzip');
var tar = require('tar');
var Q = require('q');
var mout = require('mout');
var osJunk = require('./osJunk');



zlib.Z_DEFAULT_CHUNK = 1024 * 8;

var extractors,
extractorTypes;

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

function extractZip(archive, dest) {
var deferred = Q.defer();

fs.createReadStream(archive)
.pipe(unzip.Extract({ path: dest }))
.on('error', deferred.reject)
.on('close', deferred.resolve.bind(deferred, dest));

return deferred.promise;
}

function extractTar(archive, dest) {
var deferred = Q.defer();

fs.createReadStream(archive)
.pipe(tar.Extract({ path: dest }))
.on('error', deferred.reject)
.on('close', deferred.resolve.bind(deferred, dest));

return deferred.promise;
}

function extractTarGz(archive, dest) {
var deferred = Q.defer();

fs.createReadStream(archive)
.pipe(zlib.createGunzip())
.pipe(tar.Extract({ path: dest }))
.on('error', deferred.reject)
.on('close', deferred.resolve.bind(deferred, dest));

return deferred.promise;
}

function extractGz(archive, dest) {
var deferred = Q.defer();

fs.createReadStream(archive)
.pipe(zlib.createGunzip())
.pipe(fs.createWriteStream(dest))
.on('error', deferred.reject)
.on('close', deferred.resolve.bind(deferred, dest));

return deferred.promise;
}

function getExtractor(archive) {


archive = archive.toLowerCase();

var type = mout.array.find(extractorTypes, function (type) {
return mout.string.endsWith(archive, type);
});

return type ? extractors[type] : null;
}

