module.exports = rimraf
rimraf.sync = rimrafSync

var path = require('path'),
fs

try {

fs = require('graceful-fs')
} catch (er) {
fs = require('fs')
}


var timeout = 0
exports.EMFILE_MAX = 1000
exports.BUSYTRIES_MAX = 3

var isWindows = (process.platform === 'win32')

function rimraf (p, cb) {
if (!cb) throw new Error('No callback passed to rimraf()')

var busyTries = 0
rimraf_(p, function CB (er) {
if (er) {
if (er.code === 'EBUSY' && busyTries < exports.BUSYTRIES_MAX) {
busyTries++
var time = busyTries * 100

return setTimeout(function () {
rimraf_(p, CB)
}, time)
}


if (er.code === 'EMFILE' && timeout < exports.EMFILE_MAX) {
return setTimeout(function () {
rimraf_(p, CB)
}, timeout++)
