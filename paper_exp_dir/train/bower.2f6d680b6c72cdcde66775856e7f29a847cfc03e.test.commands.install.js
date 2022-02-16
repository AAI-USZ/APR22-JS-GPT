var expect = require('expect.js');
var helpers = require('../helpers');

describe('bower install', function () {

var tempDir = new helpers.TempDir();

var install = helpers.command('install', { cwd: tempDir.path });

it('correctly reads arguments', function() {
expect(install.readOptions(['jquery', 'angular', '-F', '-p', '-S', '-D', '-E']))
.to.eql([['jquery', 'angular'], {
forceLatest: true,
production: true,
save: true,
saveDev: true,
saveExact: true
}]);
});

it('correctly reads long arguments', function() {
expect(install.readOptions([
'jquery', 'angular',
'--force-latest', '--production', '--save', '--save-dev', '--save-exact'
