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
nock('http://bower.io', opts.nockOpts)
);

download('http://bower.io/package.tar.gz', destination, opts.downloadOpts)
.then(function (result) {
if (opts.expect) {
opts.expect(result);
deferred.resolve();
} else {
deferred.reject(new Error('Error expected. Got successful response.'));
}
