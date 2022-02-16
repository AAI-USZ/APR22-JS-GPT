var expect = require('expect.js');
var helpers = require('../../helpers');

var cacheClean = helpers.command('cache/clean');
var md5 = helpers.require('lib/util/md5');
var object = require('mout/object');

describe('bower cache clean', function () {


var cacheFilesFactory = function (spec) {
var files = {};

object.map(spec, function(bowerJson) {
bowerJson._source = bowerJson.name + '/' + bowerJson.version;
var path = md5(bowerJson._source) + '/' + bowerJson.version + '/.bower.json';
files[path] = bowerJson;
});

return files;
};


var cacheFiles = cacheFilesFactory([
{
name: 'angular',
version: '1.3.8'
},
{
name: 'angular',
version: '1.3.9'
},
{
name: 'jquery',
version: '1.0.0'
}
]);

var cacheDir = new helpers.TempDir(cacheFiles);

