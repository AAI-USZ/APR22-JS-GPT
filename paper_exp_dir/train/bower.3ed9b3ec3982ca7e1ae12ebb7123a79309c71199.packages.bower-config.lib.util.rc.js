var path = require('path');
var fs = require('graceful-fs');
var optimist = require('optimist');
var osenv = require('osenv');
var mout = require('mout');
var paths = require('./paths');

var win = process.platform === 'win32';
var home = osenv.home();

function rc(name, defaults, cwd, argv) {
defaults = defaults || {};
cwd = cwd || process.cwd();
argv = argv || optimist.argv;

return mout.object.deepMixIn.apply(null, [
{},
defaults,
{ cwd: cwd },
win ? {} : json(path.join('/etc', name + 'rc')),
json(path.join(home, '.' + name + 'rc')),
json(path.join(paths.config, name + 'rc')),
json(find('.' + name + 'rc', cwd)),
env(name + '_'),
typeof argv.config !== 'object' ? {} : argv.config
]);
