var expect = require('expect.js');
var helpers = require('../helpers');
var nock = require('nock');
var path = require('path');
var Q = require('q');

var fs = require('../../lib/util/fs');
var download = require('../../lib/util/download');

describe('download', function () {

var tempDir = new helpers.TempDir(),
source = path.resolve(__dirname, '../assets/package-tar.tar.gz'),
destination = tempDir.getPath('package.tar.gz');

function downloadTest(opts) {
var deferred = Q.defer();

tempDir.prepare();

opts.response(
nock('https://bower.io', opts.nockOpts)
.get('/package.tar.gz'));

download('https://bower.io/package.tar.gz', destination, opts.downloadOpts)
.then(function () {
opts.expect();
deferred.resolve();
}, function () {
opts.expectError();
deferred.resolve();
})
.done();

return deferred.promise;
