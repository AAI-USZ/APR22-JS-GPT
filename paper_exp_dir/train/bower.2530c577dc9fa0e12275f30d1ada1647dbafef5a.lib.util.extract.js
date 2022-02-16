var path = require('path');
var fs = require('fs');
var zlib = require('zlib');
var unzip = require('unzip');
var tar = require('tar');
var Q = require('q');
var mout = require('mout');

var extractors = {
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

var extractorTypes = Object.keys(extractors);

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
var type = mout.array.find(extractorTypes, function (type) {
return mout.string.endsWith(archive, type);
});

return type ? extractors[type] : null;
}

function isSingleDir(dir) {
return Q.nfcall(fs.readdir, dir)
.then(function (files) {
var singleDir;

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
var src = path.join(dir, file),
dest = path.join(destDir, file);

return Q.nfcall(fs.rename, src, dest);
});

return Q.all(promises);
})
.then(function () {
return Q.nfcall(fs.rmdir, dir);
});
}



function canExtract(target) {
return !!getExtractor(target);
}




function extract(src, dest, opts) {
var extractor,
promise;

opts = opts || {};
extractor = getExtractor(opts.mimeType || src);


if (!extractor) {
return Q.reject(new Error('File "' + src + '" is not a known archive'));
}


promise = extractor(src, dest);


if (!opts.keepArchive) {
promise = promise
.then(function () {
return Q.nfcall(fs.unlink, src);
});
}


if (!opts.keepStructure) {
promise = promise
.then(function () {
return isSingleDir(dest);
})
.then(function (singleDir) {
return singleDir ? moveSingleDirContents(singleDir) : null;
});
}


return promise.then(function () {
return dest;
});
}

module.exports = extract;
module.exports.canExtract = canExtract;
