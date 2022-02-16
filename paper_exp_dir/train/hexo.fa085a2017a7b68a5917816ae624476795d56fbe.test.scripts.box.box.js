var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var crypto = require('crypto');
var util = require('hexo-util');
var Pattern = util.Pattern;
var testUtil = require('../../util');

function shasum(content){
var hash = crypto.createHash('sha1');
hash.update(content);
return hash.digest('hex');
}

describe('Box', function(){
var Hexo = require('../../../lib/hexo');
var baseDir = pathFn.join(__dirname, 'box_tmp');
var Box = require('../../../lib/box');

function newBox(path){
var hexo = new Hexo(baseDir, {silent: true});
var base = path ? pathFn.join(baseDir, path) : baseDir;
return new Box(hexo, base);
}

before(function(){
return fs.mkdir(baseDir);
});

after(function(){
return fs.rmdir(baseDir);
});

it('constructor - add trailing "/" to the base path', function(){
var box = newBox('foo');
box.base.should.eql(pathFn.join(baseDir, 'foo') + pathFn.sep);
});

it('addProcessor() - no pattern', function(){
var box = newBox();

box.addProcessor(function(){
return 'test';
});

var p = box.processors[0];

p.pattern.match('').should.eql({});
p.process().should.eql('test');
});

it('addProcessor() - with regex', function(){
var box = newBox();

box.addProcessor(/^foo/, function(){
return 'test';
});

var p = box.processors[0];

p.pattern.match('foobar').should.be.ok;
p.pattern.should.be.an.instanceof(Pattern);
p.process().should.eql('test');
});

it('addProcessor() - with pattern', function(){
var box = newBox();

box.addProcessor(new Pattern(/^foo/), function(){
return 'test';
});

var p = box.processors[0];

p.pattern.match('foobar').should.be.ok;
p.pattern.should.be.an.instanceof(Pattern);
p.process().should.eql('test');
});

it('addProcessor() - no fn', function(){
var box = newBox();

try {
box.addProcessor('test');
} catch (err){
err.should.have.property('message', 'fn must be a function');
}
});

it('_loadFiles() - create', function(){
var box = newBox('test');
var path = pathFn.join(box.base, 'a.txt');

return fs.writeFile(path, 'a').then(function(){
return Promise.all([
box._loadFiles(),
fs.stat(path)
]);
}).spread(function(files, stats){
var cacheId = 'test/a.txt';

files.should.eql([
{path: 'a.txt', type: 'create'}
