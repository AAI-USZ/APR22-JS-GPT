var path       = require('path');
var fs         = require('fs');
var _          = require('lodash');
var tmp        = require('tmp');

var fileExists = require('../util/file-exists').sync;

var temp = process.env.TMPDIR
|| process.env.TMP
|| process.env.TEMP
|| process.platform === 'win32' ? 'c:\\windows\\temp' : '/tmp';

var home = (process.platform === 'win32'
? process.env.USERPROFILE
: process.env.HOME) || temp;

var roaming =  process.platform === 'win32'
? path.resolve(process.env.APPDATA || home || temp)
: path.resolve(home || temp);

var folder = process.platform === 'win32'
? 'bower'
: '.bower';


var config = require('rc') ('bower', {
cache      :  path.join(roaming, folder, 'cache'),
links      :  path.join(roaming, folder, 'links'),
completion :  path.join(roaming, folder, 'completion'),
json       : 'component.json',
endpoint   : 'https://bower.herokuapp.com',
directory  : 'components'
});


var localFile = path.join(this.cwd, '.bowerrc');
if (fileExists(localFile)) {
_.extend(config, JSON.parse(fs.readFileSync(localFile)));
}



tmp.setGracefulCleanup();

module.exports = config;
