'use strict';

var should = require('chai').should();
var pathFn = require('path');
var moment = require('moment');
var Promise = require('bluebird');
var fs = require('hexo-fs');
var util = require('hexo-util');
var sinon = require('sinon');
var fixture = require('../../fixtures/post_render');

describe('Post', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'post_test'));
var post = hexo.post;
var now = Date.now();
var clock;

before(function(){
clock = sinon.useFakeTimers(now);

return fs.mkdirs(hexo.base_dir, function(){
return hexo.init();
}).then(function(){

return hexo.loadPlugin(require.resolve('hexo-renderer-marked'));
}).then(function(){
return hexo.scaffold.set('post', [
'title: {{ title }}',
'date: {{ date }}',
'tags:',
'---'
].join('\n'));
}).then(function(){
return hexo.scaffold.set('draft', [
'title: {{ title }}',
'tags:',
'---'
].join('\n'));
});
});

after(function(){
clock.restore();
return fs.rmdir(hexo.base_dir);
});

it('create()', function(){
var path = pathFn.join(hexo.source_dir, '_posts', 'Hello-World.md');
var date = moment(now);
var listener = sinon.spy();

var content = [
'title: "Hello World"',
'date: ' + date.format('YYYY-MM-DD HH:mm:ss'),
'tags:',
'---'
].join('\n') + '\n';

hexo.once('new', listener);

return post.create({
title: 'Hello World'
}).then(function(post){
post.path.should.eql(path);
post.content.should.eql(content);
listener.calledOnce.should.be.true;

return fs.readFile(path);
}).then(function(data){
data.should.eql(content);
return fs.unlink(path);
});
});

it('create() - slug', function(){
var path = pathFn.join(hexo.source_dir, '_posts', 'foo.md');
var date = moment(now);

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
var date = moment(now);

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
var date = moment(now);

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
var date = moment(now);

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
layout: 'test'
});
}).then(function(post){
post.content.should.eql([
'---',
'title: "Hello World"',
'---'
].join('\n') + '\n');

return Promise.all([
fs.unlink(post.path),
hexo.scaffold.remove('test')
]);
});
});

it('create() - JSON front-matter', function(){
var scaffold = [
'"title": {{ title }}',
';;;'
].join('\n');

return hexo.scaffold.set('test', scaffold).then(function(){
return post.create({
title: 'Hello World',
layout: 'test',
lang: 'en'
});
}).then(function(post){
post.content.should.eql([
'"title": "Hello World",',
'"lang": "en"',
';;;'
].join('\n') + '\n');

return Promise.all([
fs.unlink(post.path),
hexo.scaffold.remove('test')
]);
});
});


it('create() - non-string title', function(){
var path = pathFn.join(hexo.source_dir, '_posts', '12345.md');

return post.create({
title: 12345
}).then(function(data){
data.path.should.eql(path);
return fs.unlink(path);
});
