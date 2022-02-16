var path = require('path');
var fs = require('fs');
var mout = require('mout');
var mkdirp = require('mkdirp');


var temp = process.env.TMPDIR
|| process.env.TMP
|| process.env.TEMP
|| process.platform === 'win32' ? 'c:\\windows\\temp' : '/tmp';

var home = (process.platform === 'win32'
? process.env.USERPROFILE
: process.env.HOME) || temp;

var roaming = process.platform === 'win32'
? path.join(path.resolve(process.env.APPDATA || home || temp), 'bower')
: path.join(path.resolve(home || temp), '.bower');


var proxy = process.env.HTTPS_PROXY
|| process.env.https_proxy
|| process.env.HTTP_PROXY
|| process.env.http_proxy;




var config;
try {
config = require('rc')('bower', {
json: 'bower.json',
directory: 'bower_components',
proxy: proxy,
roaming: roaming,
cwd: process.cwd()
});
} catch (e) {
throw new Error('Unable to parse global .bowerrc file: ' + e.message);
}


var localConfig = path.join(config.cwd, '.bowerrc');
try {
localConfig = fs.readFileSync(localConfig);
