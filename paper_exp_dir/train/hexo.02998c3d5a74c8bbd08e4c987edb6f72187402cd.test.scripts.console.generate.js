'use strict';

var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var sinon = require('sinon');
var testUtil = require('../../util');

describe('generate', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'generate_test'), {silent: true});
var generate = require('../../../lib/plugins/console/generate').bind(hexo);

before(function(){
return fs.mkdirs(hexo.base_dir).then(function(){
return hexo.init();
});
});

after(function(){
return fs.rmdir(hexo.base_dir);
});

afterEach(function(){
return Promise.all([

fs.rmdir(hexo.public_dir),

hexo.model('Cache').remove({}),
hexo.model('Asset').remove({})
]);
});

function testGenerate(options){
options = options || {};

return Promise.all([

fs.writeFile(pathFn.join(hexo.source_dir, 'test.txt'), 'test'),
fs.writeFile(pathFn.join(hexo.source_dir, 'faz', 'yo.txt'), 'yoooo'),

fs.writeFile(pathFn.join(hexo.public_dir, 'foo.txt'), 'foo'),
fs.writeFile(pathFn.join(hexo.public_dir, 'bar', 'boo.txt'), 'boo'),
fs.writeFile(pathFn.join(hexo.public_dir, 'faz', 'yo.txt'), 'yo')
]).then(function(){
return generate(options);
}).then(function(){
return Promise.all([
fs.readFile(pathFn.join(hexo.public_dir, 'test.txt')),
fs.readFile(pathFn.join(hexo.public_dir, 'faz', 'yo.txt')),
fs.exists(pathFn.join(hexo.public_dir, 'foo.txt')),
fs.exists(pathFn.join(hexo.public_dir, 'bar', 'boo.txt'))
]);
}).then(function(result){

result[0].should.eql('test');


result[1].should.eql('yoooo');


result[2].should.be.false;
result[3].should.be.false;
});
}

it('default', function(){
return testGenerate();
});

it('watch - update', function(){
return testGenerate({watch: true}).then(function(){

return fs.writeFile(pathFn.join(hexo.source_dir, 'test.txt'), 'newtest');
}).then(function(){

return testUtil.wait(300);
}).then(function(){
return fs.readFile(pathFn.join(hexo.public_dir, 'test.txt'));
}).then(function(content){

content.should.eql('newtest');


hexo.unwatch();
});
});

it('watch - delete', function(){
return testGenerate({watch: true}).then(function(){
return fs.unlink(pathFn.join(hexo.source_dir, 'test.txt'));
}).then(function(){
return testUtil.wait(300);
}).then(function(){
return fs.exists(pathFn.join(hexo.public_dir, 'test.txt'));
}).then(function(exist){
exist.should.be.false;
