var expect = require('expect.js');
var object = require('mout').object;

var helpers = require('../helpers');

var commands = {
install: helpers.command('install'),
list: helpers.command('list')
};

describe('bower list', function () {

var tempDir = new helpers.TempDir();

var gitPackage = new helpers.TempDir();

var install = function(packages, options, config) {
config = object.merge(config || {}, {
cwd: tempDir.path
});

return helpers.run(commands.install, [packages, options, config]);
};

var list = function(options, config) {
config = object.merge(config || {}, {
cwd: tempDir.path
});

return helpers.run(commands.list, [options, config]);
};

it('correctly reads arguments', function() {
expect(commands.list.readOptions(['-p', '-r']))
.to.eql([{
paths: true,
relative: true
}]);
});

it('correctly reads long arguments', function() {
expect(commands.list.readOptions(['--paths', '--relative']))
