var Q = require('q');
var expect = require('expect.js');
var helpers = require('../helpers');

var register = helpers.command('register');

var fakeRepositoryFactory = function (canonicalDir, pkgMeta) {
function FakeRepository() { }

FakeRepository.prototype.fetch = function() {
return Q.fcall(function () {
return [canonicalDir, pkgMeta];
});
};
