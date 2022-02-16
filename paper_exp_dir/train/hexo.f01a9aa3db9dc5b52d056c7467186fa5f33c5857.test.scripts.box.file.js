'use strict';

var should = require('chai').should();
var pathFn = require('path');
var Promise = require('bluebird');
var fs = require('hexo-fs');
var yaml = require('js-yaml');

describe('File', function() {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var Box = require('../../../lib/box');
var box = new Box(hexo, pathFn.join(hexo.base_dir, 'file_test'));
var File = box.File;

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

var file = new File({
source: pathFn.join(box.base, path),
path: path,
type: 'create',
params: {foo: 'bar'},
content: new Buffer(body),
stats: {}
});

before(function() {
return Promise.all([
fs.writeFile(file.source, body),
hexo.init()
]);
});

after(function() {
return fs.rmdir(box.base);
});

it('read()', function() {
return file.read().then(function(content) {
content.should.eql(body);
});
});

it('read() - callback', function(callback) {
file.read(function(err, content) {
should.not.exist(err);
content.should.eql(body);
callback();
});
});

it('read() - raw buffer', function() {
file.read({encoding: null}).then(function(content) {
