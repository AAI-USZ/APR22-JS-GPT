var expect = require('expect.js');
var object = require('mout').object;
var semver = require('semver');

var helpers = require('../helpers');
var updateCmd = helpers.command('update');
var commands = helpers.require('lib/index').commands;

describe('bower update', function () {
this.timeout(10000);

var tempDir = new helpers.TempDir();

var subPackage = new helpers.TempDir({
'bower.json': {
name: 'subPackage'
}
}).prepare();

var gitPackage = new helpers.TempDir();

gitPackage.prepareGit({
'1.0.0': {
'bower.json': {
name: 'package'
