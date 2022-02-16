var path = require('path');
var bower = require('../../lib/index.js');
var mkdirp = require('mkdirp');
var rimraf = require('../../lib/util/rimraf');
var fs = require('../../lib/util/fs');
var expect = require('expect.js');
var scripts = require('../../lib/core/scripts.js');

describe('scripts', function () {

var tempDir = path.join(__dirname, '../tmp/temp-scripts');
var packageName = 'package-zip';
var packageDir = path.join(__dirname, '../assets/' + packageName + '.zip');


var touch = function (file) {
return 'node -e "var fs = require(\'fs\'); fs.closeSync(fs.openSync(\'' + file + '\', \'w\'));"';
};


var touchWithPid = function (file) {
return 'node -e "var fs = require(\'fs\'); fs.closeSync(fs.openSync(process.env.BOWER_PID + \'' + file + '\', \'w\'));"';
};

var config = {
cwd: tempDir,
scripts: {
preinstall: touch('preinstall_%_%'),
postinstall: touch('postinstall_%_%'),
preuninstall: touch('preuninstall_%_%'),
postuninstall: touch('postuninstall_%_%')
}
};

before(function (next) {
mkdirp(tempDir, next);
});

after(function (next) {
