var expect = require('expect.js');
var helpers = require('../helpers');

var fakeRepositoryFactory = function() {
function FakeRepository() {}

FakeRepository.prototype.getRegistryClient = function() {
return {
unregister: function(name, cb) {
cb(null, { name: name });
}
};
};

return FakeRepository;
};

var unregister = helpers.command('unregister');

var unregisterFactory = function() {
return helpers.command('unregister', {
'../core/PackageRepository': fakeRepositoryFactory()
});
};

describe('bower unregister', function() {
it('correctly reads arguments', function() {
expect(unregister.readOptions(['jquery'])).to.eql(['jquery']);
});

