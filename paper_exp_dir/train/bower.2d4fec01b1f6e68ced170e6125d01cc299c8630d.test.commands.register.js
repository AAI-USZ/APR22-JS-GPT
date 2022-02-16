var Q = require('q');
var expect = require('expect.js');
var helpers = require('../helpers');

var fakeRepositoryFactory = function (canonicalDir, pkgMeta) {
function FakeRepository() { }

FakeRepository.prototype.fetch = function() {
return Q.fcall(function () {
return [canonicalDir, pkgMeta];
});
};

FakeRepository.prototype.getRegistryClient = function() {
return {
register: function (name, url, cb) {
cb(null, { name: name, url: url });
}
};
};

return FakeRepository;
};

var register = helpers.command('register');

var registerFactory = function (canonicalDir, pkgMeta) {
return helpers.command('register', {
'../core/PackageRepository': fakeRepositoryFactory(
canonicalDir, pkgMeta
)
});
};

describe('bower register', function () {

var package = new helpers.TempDir({
'bower.json': {
name: 'package'
}
});

it('errors if name is not provided', function () {
return helpers.run(register).fail(function(reason) {
expect(reason.message).to.be('Usage: bower register <name> <url>');
expect(reason.code).to.be('EINVFORMAT');
});
});

it('errors if url is not provided', function () {
return helpers.run(register, ['some-name'])
.fail(function(reason) {
