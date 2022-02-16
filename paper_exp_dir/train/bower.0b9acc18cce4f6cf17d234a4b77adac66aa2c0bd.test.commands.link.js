var expect = require('expect.js');
var helpers = require('../helpers');

var link = helpers.command('link');

describe('bower link', function () {

var package = new helpers.TempDir({
'bower.json': {
name: 'package',
},
'index.js': 'Hello World!'
});

var otherPackage = new helpers.TempDir({
'bower.json': {
name: 'package2',
},
'index.js': 'Welcome World!'
});

var linksDir = new helpers.TempDir();

beforeEach(function() {
package.prepare();
otherPackage.prepare();
linksDir.prepare();
});

it('correctly reads arguments', function() {
expect(link.readOptions(['jquery', 'angular']))
.to.eql(['jquery', 'angular']);
});

it('creates self link', function () {
return helpers.run(link, [undefined, undefined,
{
cwd: package.path,
storage: {
