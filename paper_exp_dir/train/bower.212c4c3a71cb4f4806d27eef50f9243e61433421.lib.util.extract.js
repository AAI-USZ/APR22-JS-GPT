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
follow: true,
filter: filterSymlinks
}))
.on('error', deferred.reject)
.on('close', deferred.resolve.bind(deferred, dst));

return deferred.promise;
}
