var path = require('path');
var fs = require('graceful-fs');
var zlib = require('zlib');
var DecompressZip = require('decompress-zip');
var tar = require('tar-fs');
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
'application/x-zip': extractZip,
'application/x-zip-compressed': extractZip,
'application/x-tar': extractTar,
'application/x-tgz': extractTarGz,
'application/x-gzip': extractGz
};

extractorTypes = Object.keys(extractors);

function extractZip(archive, dst) {
var deferred = Q.defer();

new DecompressZip(archive)
.on('error', deferred.reject)
.on('extract', deferred.resolve.bind(deferred, dst))
.extract({
path: dst,
follow: false,
filter: filterSymlinks
});

return deferred.promise;
}

function extractTar(archive, dst) {
var deferred = Q.defer();

fs.createReadStream(archive)
.on('error', deferred.reject)
.pipe(tar.extract(dst, {
ignore: isSymlink,
dmode: 0555,
fmode: 0444
}))
.on('error', deferred.reject)
.on('finish', deferred.resolve.bind(deferred, dst));

return deferred.promise;
}

