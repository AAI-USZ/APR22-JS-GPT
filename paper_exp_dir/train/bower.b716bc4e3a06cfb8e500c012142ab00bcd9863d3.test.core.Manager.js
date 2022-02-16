var expect = require('expect.js');
var path = require('path');
var rimraf = require('../../lib/util/rimraf');
var Logger = require('bower-logger');
var Manager = require('../../lib/core/Manager');
var defaultConfig = require('../../lib/config');

describe('Manager', function () {
var manager;

var packagesCacheDir =
path.join(__dirname, '../assets/temp-resolve-cache');

var registryCacheDir =
path.join(__dirname, '../assets/temp-registry-cache');

after(function () {
rimraf.sync(registryCacheDir);
rimraf.sync(packagesCacheDir);
});

beforeEach(function (next) {
var logger = new Logger();

var config = defaultConfig({
storage: {
packages: packagesCacheDir,
registry: registryCacheDir
}
});

manager = new Manager(config, logger);

next();
});

describe('resolve', function () {
it('prefers exact versions over ranges', function () {
manager._resolved = {
ember: [
{
target: '>=1.4',
pkgMeta: { version: '2.7.0' }
},
{
target: '2.7.0',
