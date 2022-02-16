var expect = require('expect.js');
var helpers = require('../helpers');

var init = helpers.command('init');

describe('bower init', function () {

var package = new helpers.TempDir();

it('correctly reads arguments', function() {
expect(init.readOptions([]))
.to.eql([]);
});

it('generates bower.json file', function () {
package.prepare();

var logger = init({
cwd: package.path,
interactive: true
