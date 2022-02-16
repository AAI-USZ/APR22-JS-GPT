var path = require('path');
var bower = require('../../lib/index.js');
var mkdirp = require('mkdirp');
var rimraf = require('../../lib/util/rimraf');
var fs = require('../../lib/util/fs');
var expect = require('expect.js');
var scripts = require('../../lib/core/scripts.js');

describe('scripts', function() {
var tempDir = path.join(__dirname, '../tmp/temp-scripts');
var packageName = 'package-zip';
var packageDir = path.join(__dirname, '../assets/' + packageName + '.zip');


var touch = function(file) {
return (
"node -e \"var fs = require('fs'); fs.closeSync(fs.openSync('" +
file +
"', 'w'));\""
