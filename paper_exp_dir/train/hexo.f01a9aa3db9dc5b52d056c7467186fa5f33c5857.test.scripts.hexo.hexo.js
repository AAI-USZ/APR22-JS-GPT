'use strict';

var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var sinon = require('sinon');
var sep = pathFn.sep;
var testUtil = require('../../util');

describe('Hexo', function() {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'hexo_test'), {silent: true});
var coreDir = pathFn.join(__dirname, '../../..');
var version = require('../../../package.json').version;
var Post = hexo.model('Post');
var Page = hexo.model('Page');
var Data = hexo.model('Data');
var route = hexo.route;

function checkStream(stream, expected) {
return testUtil.stream.read(stream).then(function(data) {
data.should.eql(expected);
});
}

function loadAssetGenerator() {
hexo.extend.generator.register('asset', require('../../../lib/plugins/generator/asset'));
}

before(function() {
return fs.mkdirs(hexo.base_dir).then(function() {
return hexo.init();
});
});

beforeEach(function() {

hexo.extend.generator.store = {};

route.routes = {};
});

after(function() {
return fs.rmdir(hexo.base_dir);
});

hexo.extend.console.register('test', function(args) {
return args;
});

it('constructor', function() {
