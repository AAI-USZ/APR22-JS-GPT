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
.on('error', deferred.reject)
.pipe(unzip.Extract({ path: dest }))
.on('error', deferred.reject)
.on('close', deferred.resolve.bind(deferred, dest));

return deferred.promise;
}

function extractTar(archive, dest) {
var deferred = Q.defer();
