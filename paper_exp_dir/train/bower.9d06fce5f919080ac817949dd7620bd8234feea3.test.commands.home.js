var expect = require('expect.js');
var helpers = require('../helpers');

describe('bower home', function () {

var package = new helpers.TempDir({
'bower.json': {
name: 'package',
homepage: 'http://bower.io'
}
});

var wrongPackage = new helpers.TempDir({
'bower.json': {
name: 'package'
}
});

it('opens repository home page in web browser', function (done) {
package.prepare();

var home = helpers.command('home', {
opn: helpers.ensureDone(done, function(url) {
