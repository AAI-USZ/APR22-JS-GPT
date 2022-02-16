var fs = require('fs');
var path = require('path');
var Q = require('q');
var mkdirp = require('mkdirp');
var createError = require('./createError');

var isWin = process.platform === 'win32';

function createLink(src, dst, type) {
var dstDir = path.dirname(dst);


return Q.nfcall(mkdirp, dstDir)

.then(function () {
return Q.nfcall(fs.stat, src)
.fail(function (error) {
if (error.code === 'ENOENT') {
throw createError('Failed to create link to ' + path.basename(src), 'ENOENT', {
details: src + ' doest not exists or points to a non-existent file'
});
}

throw error;
});
})

.then(function (stat) {
type = type || (stat.isDirectory() ? 'dir' : 'file');

return Q.nfcall(fs.symlink, src, dst, type)
.fail(function (err) {
