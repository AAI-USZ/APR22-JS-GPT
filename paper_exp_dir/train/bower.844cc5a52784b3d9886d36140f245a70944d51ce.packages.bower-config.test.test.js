var assert = require('assert');
var path = require('path');

describe('NPM Config on package.json', function () {
beforeEach(function () {
delete process.env.npm_package_config_bower_directory;
delete process.env.npm_package_config_bower_colors;
delete process.env.npm_package_config_bower_resolvers;
});

it('defaults registry entries to default registry', function () {
var config = require('../lib/Config').read(null, {});

assert.deepEqual(config.registry, {
'default': 'https://bower.herokuapp.com',
'search': [
'https://bower.herokuapp.com'
