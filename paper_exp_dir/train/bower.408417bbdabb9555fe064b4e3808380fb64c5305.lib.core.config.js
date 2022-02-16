var path = require('path');
var fs = require('fs');
var mout = require('mout');
var tmp = require('tmp');


var temp = process.env.TMPDIR
|| process.env.TMP
|| process.env.TEMP
|| process.platform === 'win32' ? 'c:\\windows\\temp' : '/tmp';

var home = (process.platform === 'win32'
? process.env.USERPROFILE
: process.env.HOME) || temp;

var roaming = process.platform === 'win32'
? path.resolve(process.env.APPDATA || home || temp)
: path.resolve(home || temp);

var folder = process.platform === 'win32'
? 'bower'
: '.bower';

var proxy = process.env.HTTPS_PROXY
|| process.env.https_proxy
|| process.env.HTTP_PROXY
|| process.env.http_proxy;


var config;
try {
config = require('rc')('bower', {
cwd: process.cwd(),
roaming: path.join(roaming, folder),
json: 'bower.json',
directory: 'bower_components',
proxy: proxy
});
} catch (e) {
throw new Error('Unable to parse global .bowerrc file: ' + e.message);
}


var localConfig = path.join(config.cwd, '.bowerrc');
try {
localConfig = fs.readFileSync(localConfig);
try {
mout.object.mixIn(config, JSON.parse(localConfig));
} catch (e) {
throw new Error('Unable to parse local .bowerrc file: ' + e.message);
}
} catch (e) {}



tmp.setGracefulCleanup();

module.exports = config;
