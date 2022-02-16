var path = require('path');
var fs = require('graceful-fs');
var optimist = require('optimist');
var osenv = require('osenv');
var mout = require('mout');
var paths = require('./paths');

var win = process.platform === 'win32';
var home = osenv.home();

function rc(name, defaults, cwd, argv) {
var argvConfig;

defaults = defaults || {};
cwd = cwd || process.cwd();
argv = argv || optimist.argv;


argvConfig = mout.object.map(argv.config || {}, function (value) {
return value === 'false' ? false : value;
});

return mout.object.deepMixIn.apply(null, [
{},
defaults,
{ cwd: cwd },
win ? {} : json(path.join('/etc', name + 'rc')),
json(path.join(home, '.' + name + 'rc')),
json(path.join(paths.config, name + 'rc')),
json(find('.' + name + 'rc', cwd)),
env(name + '_'),
argvConfig
]);
}

function parse(content, file) {
var error;

if (!content.trim().length) {
return {};
}

try {
return JSON.parse(content);
} catch (e) {
if (file) {
error = new Error('Unable to parse ' + file + ': ' + e.message);
} else {
error = new Error('Unable to parse rc config: ' + e.message);
}

error.details = content;
error.code = 'EMALFORMED';
throw error;
}

return null;
}

function json(file) {
var content;

try {
content = fs.readFileSync(file).toString();
} catch (err) {
return null;
}

return parse(content, file);
}

function env(prefix) {
var obj = {};
var prefixLength = prefix.length;

prefix = prefix.toLowerCase();

mout.object.forOwn(process.env, function (value, key) {
key = key.toLowerCase();

if (mout.string.startsWith(key, prefix)) {
var parsedKey = key
.substr(prefixLength)
.replace(/__/g, '.')
.replace(/_/g, '-');
