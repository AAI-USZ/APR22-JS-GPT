var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var crypto = require('crypto');

function wait(ms){
return new Promise(function(resolve, reject){
setTimeout(function(){
resolve();
}, ms);
});
}

function checksum(content){
var hash = crypto.createHash('sha1');
hash.update(content);
return hash.digest('hex');
}

describe('Box', function(){
var Hexo = require('../../../lib/hexo');
var baseDir = pathFn.join(__dirname, 'box_tmp');
var Box = require('../../../lib/box');
var Pattern = Box.Pattern;

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

