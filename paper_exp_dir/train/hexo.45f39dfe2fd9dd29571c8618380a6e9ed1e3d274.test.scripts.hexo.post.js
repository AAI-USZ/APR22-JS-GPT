var should = require('chai').should();
var pathFn = require('path');
var moment = require('moment');
var Promise = require('bluebird');
var fs = require('hexo-fs');
var util = require('hexo-util');
var fixture = require('../../fixtures/post_render');

describe('Post', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'post_test'));
var post = hexo.post;

before(function(){
return fs.mkdirs(hexo.base_dir, function(){
return hexo.init();
}).then(function(){

return hexo.loadPlugin(require.resolve('hexo-renderer-marked'));
});
});

after(function(){
return fs.rmdir(hexo.base_dir);
});

it('create()', function(){
var emitted = false;
var path = pathFn.join(hexo.source_dir, '_posts', 'Hello-World.md');
var date = moment();

var content = [
'title: "Hello World"',
'date: ' + date.format('YYYY-MM-DD HH:mm:ss'),
'tags:',
'---'
].join('\n') + '\n';

hexo.once('new', function(){
emitted = true;
});

return post.create({
title: 'Hello World'
}).then(function(post){
post.path.should.eql(path);
post.content.should.eql(content);
emitted.should.be.true;

return fs.readFile(path);
}).then(function(data){
data.should.eql(content);
return fs.unlink(path);
});
});

it('create() - slug', function(){
var path = pathFn.join(hexo.source_dir, '_posts', 'foo.md');
var date = moment();

var content = [
'title: "Hello World"',
'date: ' + date.format('YYYY-MM-DD HH:mm:ss'),
'tags:',
'---'
].join('\n') + '\n';

return post.create({
title: 'Hello World',
slug: 'foo'
}).then(function(post){
post.path.should.eql(path);
post.content.should.eql(content);

return fs.readFile(path);
}).then(function(data){
data.should.eql(content);
return fs.unlink(path);
});
});

it('create() - filename_case', function(){
hexo.config.filename_case = 1;

var path = pathFn.join(hexo.source_dir, '_posts', 'hello-world.md');
var date = moment();

var content = [
'title: "Hello World"',
'date: ' + date.format('YYYY-MM-DD HH:mm:ss'),
'tags:',
'---'
].join('\n') + '\n';

return post.create({
title: 'Hello World'
}).then(function(post){
post.path.should.eql(path);
post.content.should.eql(content);
hexo.config.filename_case = 0;

return fs.readFile(path);
}).then(function(data){
data.should.eql(content);
return fs.unlink(path);
});
});

it('create() - layout', function(){
var path = pathFn.join(hexo.source_dir, '_posts', 'Hello-World.md');
var date = moment();

var content = [
'layout: photo',
'title: "Hello World"',
'date: ' + date.format('YYYY-MM-DD HH:mm:ss'),
'tags:',
'---'
].join('\n') + '\n';

return post.create({
title: 'Hello World',
layout: 'photo'
}).then(function(post){
post.path.should.eql(path);
post.content.should.eql(content);

return fs.readFile(path);
}).then(function(data){
data.should.eql(content);
return fs.unlink(path);
});
});

it('create() - extra data', function(){
var path = pathFn.join(hexo.source_dir, '_posts', 'Hello-World.md');
var date = moment();

var content = [
'title: "Hello World"',
'date: ' + date.format('YYYY-MM-DD HH:mm:ss'),
'tags:',
'foo: bar',
'---'
].join('\n') + '\n';

return post.create({
title: 'Hello World',
foo: 'bar'
}).then(function(post){
post.path.should.eql(path);
post.content.should.eql(content);

return fs.readFile(path);
}).then(function(data){
data.should.eql(content);
return fs.unlink(path);
});
});

it('create() - rename if target existed', function(){
var path = pathFn.join(hexo.source_dir, '_posts', 'Hello-World-1.md');

return post.create({
title: 'Hello World'
}).then(function(){
return post.create({
title: 'Hello World'
});
}).then(function(post){
post.path.should.eql(path);
return fs.exists(path);
}).then(function(exist){
exist.should.be.true;

return Promise.all([
fs.unlink(path),
fs.unlink(pathFn.join(hexo.source_dir, '_posts', 'Hello-World.md'))
]);
});
});

it('create() - replace existing files', function(){
var path = pathFn.join(hexo.source_dir, '_posts', 'Hello-World.md');

return post.create({
title: 'Hello World'
}).then(function(){
return post.create({
title: 'Hello World'
}, true);
}).then(function(post){
post.path.should.eql(path);
return fs.unlink(path);
});
});

it('create() - asset folder', function(){
var path = pathFn.join(hexo.source_dir, '_posts', 'Hello-World');

hexo.config.post_asset_folder = true;

return post.create({
title: 'Hello World'
}).then(function(post){
hexo.config.post_asset_folder = false;
return fs.stat(path);
}).then(function(stats){
stats.isDirectory().should.be.true;
return fs.unlink(path + '.md');
});
});

it('create() - follow the separator style in the scaffold', function(){
var scaffold = [
'---',
'title: {{ title }}',
'---'
].join('\n');

return hexo.scaffold.set('test', scaffold).then(function(){
return post.create({
title: 'Hello World',
