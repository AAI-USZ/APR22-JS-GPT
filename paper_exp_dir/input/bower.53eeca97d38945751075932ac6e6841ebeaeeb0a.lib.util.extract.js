var path = require('path');
var fs = require('./fs');
var zlib = require('zlib');
var DecompressZip = require('decompress-zip');
var tar = require('tar-fs');
var Q = require('q');
var mout = require('mout');
var junk = require('junk');
var createError = require('./createError');
var createWriteStream = require('fs-write-stream-atomic');
var destroy = require('destroy');
var tmp = require('tmp');



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

var stream = fs.createReadStream(archive);

var reject = function (error) {
destroy(stream);
deferred.reject(error);
};

stream.on('error', reject)
.pipe(tar.extract(dst, {
ignore: isSymlink,
dmode: 0555,
fmode: 0444
}))
.on('error', reject)
.on('finish', function (result) {
destroy(stream);
deferred.resolve(dst);
});

return deferred.promise;
}

function extractTarGz(archive, dst) {
var deferred = Q.defer();

var stream = fs.createReadStream(archive);

var reject = function (error) {
destroy(stream);
deferred.reject(error);
};

stream.on('error', reject)
.pipe(zlib.createGunzip())
.on('error', reject)
.pipe(tar.extract(dst, {
ignore: isSymlink,
dmode: 0555,
fmode: 0444
}))
.on('error', reject)
.on('finish', function (result) {
destroy(stream);
deferred.resolve(dst);
});

return deferred.promise;
}

function extractGz(archive, dst) {
var deferred = Q.defer();

var stream = fs.createReadStream(archive);

var reject = function (error) {
destroy(stream);
deferred.reject(error);
};
stream.on('error', reject)
.pipe(zlib.createGunzip())
.on('error', reject)
.pipe(createWriteStream(dst))
.on('error', reject)
.on('finish', function (result) {
destroy(stream);
deferred.resolve(dst);
});

return deferred.promise;
}

function isSymlink(entry) {
return entry.type === 'SymbolicLink';
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

function moveDirectory(srcDir, destDir) {
return Q.nfcall(fs.readdir, srcDir)
var promises = files.map(function (file) {
var src = path.join(srcDir, file);
var dst = path.join(destDir, file);

return Q.nfcall(fs.rename, src, dst);
});

return Q.all(promises);
})
.then(function () {
return Q.nfcall(fs.rmdir, srcDir);
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

opts = opts || {};
extractor = getExtractor(src);


if (!extractor && opts.mimeType) {
extractor = getExtractor(opts.mimeType);
}


if (!extractor) {
return Q.reject(createError('File ' + src + ' is not a known archive', 'ENOTARCHIVE'));
}


return Q.nfcall(tmp.dir, {
template: dst + '-XXXXXX',
mode: 0777 & ~process.umask()
}).then(function (tempDir) {

return Array.isArray(tempDir) ? tempDir[0] : tempDir;
}).then(function (tempDir) {


promise = Q.nfcall(fs.stat, src)
.then(function (stat) {
if (stat.size <= 8) {
throw createError('File ' + src + ' is an invalid archive', 'ENOTARCHIVE');
}


return extractor(src, tempDir);
});


if (!opts.keepArchive) {
promise = promise
.then(function () {
return Q.nfcall(fs.unlink, src);
});
}




promise = promise
.then(function () {
return isSingleDir(tempDir);
})
.then(function (singleDir) {
if (singleDir && !opts.keepStructure) {
return moveDirectory(singleDir, dst);
} else {
return moveDirectory(tempDir, dst);
}
});


return promise.then(function () {
return dst;
});
});
}

module.exports = extract;
module.exports.canExtract = canExtract;
