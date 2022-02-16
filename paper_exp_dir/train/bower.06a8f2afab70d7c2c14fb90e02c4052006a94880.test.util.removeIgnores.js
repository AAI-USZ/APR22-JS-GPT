var expect = require('expect.js');
var helpers = require('../helpers');
var glob = require('glob');
var Q = require('q');

var removeIgnores = require('../../lib/util/removeIgnores');

describe('removeIgnores', function () {

var tempDir = new helpers.TempDir({
'bower.json': {},
'index.js': 'Not to ignore',
'node_modules/underscore/index.js': 'Should be ignored'
});

var ignoreTest = function(dir, meta, leftovers) {
tempDir.prepare();

var deferred = Q.defer();

removeIgnores(dir, meta).then(function() {
glob('**/*.*', { cwd: dir }, function(cb, files) {
expect(files).to.eql(leftovers);
deferred.resolve();
});
});
