var assert = require('assert');
var path = require('path');

describe('NPM Config on package.json', function () {
function assertCAContents(caData, name) {
var r = /-----BEGIN CERTIFICATE-----[a-zA-Z0-9+\/=\n\r]+-----END CERTIFICATE-----/;

assert(caData, name + ' should be set');
assert(Array.isArray(caData), name + ' should be an array');
assert.equal(2, caData.length);
caData.forEach(function(c, i) {
assert(c.match(r),
name + '[' + i + '] should contain a certificate. Given: ' + JSON.stringify(c));
});
}

describe('Setting process.env.npm_package_config', function () {
process.env.npm_package_config_bower_directory = 'npm-path';
process.env.npm_package_config_bower_colors = false;

var config = require('../lib/Config').read();

it('should return "npm-path" for "bower_directory"', function () {
assert.equal('npm-path', config.directory);
});
it('should return "false" for "bower_colors"', function () {
assert.equal('false', config.colors);
