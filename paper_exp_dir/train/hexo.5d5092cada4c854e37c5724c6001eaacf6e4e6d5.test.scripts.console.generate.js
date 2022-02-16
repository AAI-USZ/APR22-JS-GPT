'use strict';

var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var sinon = require('sinon');

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

it('write file if not exist', function(){
var src = pathFn.join(hexo.source_dir, 'test.txt');
var dest = pathFn.join(hexo.public_dir, 'test.txt');
var content = 'test';


return fs.writeFile(src, content).then(function(){

return generate({});
}).then(function(){

return fs.unlink(dest);
}).then(function(){

return generate({});
}).then(function(){
return fs.readFile(dest);
}).then(function(result){
result.should.eql(content);


return Promise.all([
fs.unlink(src),
fs.unlink(dest)
]);
});
});

it('don\'t write if file unchanged', function(){
var src = pathFn.join(hexo.source_dir, 'test.txt');
var dest = pathFn.join(hexo.public_dir, 'test.txt');
var content = 'test';
var newContent = 'newtest';


return fs.writeFile(src, content).then(function(){

return generate({});
}).then(function(){

return fs.writeFile(dest, newContent);
}).then(function(){

return generate({});
}).then(function(){

return fs.readFile(dest);
}).then(function(result){

result.should.eql(newContent);


return Promise.all([
fs.unlink(src),
fs.unlink(dest)
]);
});
});

it('force regenerate', function(){
var src = pathFn.join(hexo.source_dir, 'test.txt');
var dest = pathFn.join(hexo.public_dir, 'test.txt');
var content = 'test';
var mtime;

return fs.writeFile(src, content).then(function(){

return generate({});
}).then(function(){

return fs.stat(dest);
}).then(function(stats){
