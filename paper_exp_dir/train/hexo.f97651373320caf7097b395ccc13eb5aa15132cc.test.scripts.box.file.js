'use strict';

var should = require('chai').should();
var pathFn = require('path');
var Promise = require('bluebird');
var fs = require('hexo-fs');
var yaml = require('js-yaml');
var _ = require('lodash');
var util = require('hexo-util');

describe('File', function() {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var Box = require('../../../lib/box');
var box = new Box(hexo, pathFn.join(hexo.base_dir, 'file_test'));
var File = box.File;
var Cache = box.Cache;

var body = [
'name:',
'  first: John',
'  last: Doe',
'',
'age: 23',
'',
'list:',
'- Apple',
'- Banana'
].join('\n');

var obj = yaml.load(body);
var path = 'test.yml';
var hash = util.hash(body).toString('hex');
var stats;

function makeFile(path, props) {
return new File(_.assign({
source: pathFn.join(box.base, path),
path: path
}, props));
}

function getCacheId(path) {
return 'file_test/' + path;
}

function removeCache(path) {
return Cache.removeById(getCacheId(path));
}

var file = makeFile(path, {
source: pathFn.join(box.base, path),
path: path,
type: 'create',
params: {foo: 'bar'}
});

before(function() {
return Promise.all([
fs.writeFile(file.source, body),
hexo.init()
]).then(function() {
return fs.stat(file.source);
}).then(function(stats_) {
stats = stats_;
});
});

after(function() {
return fs.rmdir(box.base);
});

it('read()', function() {
return file.read().should.eventually.eql(body);
});

it('read() - callback', function(callback) {
file.read(function(err, content) {
should.not.exist(err);
content.should.eql(body);
callback();
});
});

it('readSync()', function() {
file.readSync().should.eql(body);
});

it('stat()', function() {
return Promise.all([
fs.stat(file.source),
file.stat()
]).then(function(stats) {
stats[0].should.eql(stats[1]);
});
});

