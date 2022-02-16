var path = require('path');
var fs = require('graceful-fs');
var optimist = require('optimist');
var osenv = require('osenv');
var object = require('mout/object');
var string = require('mout/string');
var paths = require('./paths');
var defaults = require('./defaults');

var win = process.platform === 'win32';
var home = osenv.home();

function rc(name, cwd, argv) {
var argvConfig;

argv = argv || optimist.argv;


argvConfig = object.map(argv.config || {}, function (value) {
return value === 'false' ? false : value;
});

if (cwd) {
return object.deepMixIn.apply(null, [
{},
defaults,
{ cwd: cwd },
win ? {} : json(path.join('/etc', name + 'rc')),
!home ? {} : json(path.join(home, '.' + name + 'rc')),
json(path.join(paths.config, name + 'rc')),
json(find('.' + name + 'rc', cwd)),
env('npm_package_config_' + name + '_'),
env(name + '_'),
argvConfig
]);
} else {
return object.deepMixIn.apply(null, [
{},
defaults,
win ? {} : json(path.join('/etc', name + 'rc')),
!home ? {} : json(path.join(home, '.' + name + 'rc')),
json(path.join(paths.config, name + 'rc')),
env('npm_package_config_' + name + '_'),
