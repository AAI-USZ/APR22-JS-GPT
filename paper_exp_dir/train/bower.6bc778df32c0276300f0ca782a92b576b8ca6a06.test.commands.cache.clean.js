var expect = require('expect.js');
var md5 = require('md5-hex');
var helpers = require('../../helpers');

var cacheClean = helpers.command('cache/clean');
var object = require('mout/object');

describe('bower cache clean', function() {

var cacheFilesFactory = function(spec) {
var files = {};

object.map(spec, function(bowerJson) {
bowerJson._source = bowerJson.name + '/' + bowerJson.version;
var path =
md5(bowerJson._source) +
'/' +
bowerJson.version +
