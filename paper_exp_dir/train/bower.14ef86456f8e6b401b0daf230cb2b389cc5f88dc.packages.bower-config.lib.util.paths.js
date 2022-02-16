var os = require('os');
var path = require('path');
var osenv = require('osenv');



var paths = {
config: process.env.XDG_CONFIG_HOME,
data: process.env.XDG_DATA_HOME,
cache: process.env.XDG_CACHE_HOME
};


var user = (osenv.user() || 'unknown').replace(/\\/g, '-');
var temp = path.join(os.tmpdir ? os.tmpdir() : os.tmpDir(), user);
var home = osenv.home();
var base;


if (process.platform === 'win32') {
base = path.resolve(process.env.APPDATA || home || temp);
base = path.join(base, 'bower');

paths.config = paths.config || path.join(base, 'config');
paths.data = paths.data || path.join(base, 'data');
paths.cache = paths.cache || path.join(base, 'cache');

} else {
base = path.resolve(home || temp);

paths.config = paths.config || path.join(base, '.config/bower');
paths.data = paths.data || path.join(base, '.local/share/bower');
paths.cache = paths.cache || path.join(base, '.cache/bower');
}

module.exports = paths;
