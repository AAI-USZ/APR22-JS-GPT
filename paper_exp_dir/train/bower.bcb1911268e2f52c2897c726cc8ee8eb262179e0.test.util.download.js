var expect = require('expect.js');
var helpers = require('../helpers');
var nock = require('../util/nock');
var path = require('path');
var Q = require('q');

var fs = require('../../lib/util/fs');
var download = require('../../lib/util/download');

describe('download', function() {
var tempDir = new helpers.TempDir(),
source = path.resolve(__dirname, '../assets/package-tar.tar.gz'),
destination = tempDir.getPath('package.tar.gz');

function downloadTest(opts) {
tempDir.prepare();

opts.response(nock('http://bower.io', opts.nockOpts));

return download(
opts.sourceUrl || 'http://bower.io/package.tar.gz',
opts.destinationPath || destination,
opts.downloadOpts
).then(
function(result) {
if (opts.expect) {
opts.expect(result);
} else {
throw new Error('Error expected. Got successful response.');
}
},
function(error) {
if (opts.expectError) {
