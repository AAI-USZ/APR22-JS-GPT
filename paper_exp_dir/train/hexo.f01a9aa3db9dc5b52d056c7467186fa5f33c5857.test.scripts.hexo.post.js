'use strict';

var should = require('chai').should();
var pathFn = require('path');
var moment = require('moment');
var Promise = require('bluebird');
var fs = require('hexo-fs');
var util = require('hexo-util');
var sinon = require('sinon');
var frontMatter = require('hexo-front-matter');
var fixture = require('../../fixtures/post_render');

describe('Post', function() {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'post_test'));
var post = hexo.post;
var now = Date.now();
var clock;

before(function() {
clock = sinon.useFakeTimers(now);

return fs.mkdirs(hexo.base_dir, function() {
return hexo.init();
}).then(function() {

return hexo.loadPlugin(require.resolve('hexo-renderer-marked'));
}).then(function() {
return hexo.scaffold.set('post', [
'title: {{ title }}',
'date: {{ date }}',
'tags:',
'---'
].join('\n'));
}).then(function() {
return hexo.scaffold.set('draft', [
'title: {{ title }}',
'tags:',
'---'
].join('\n'));
});
});

after(function() {
clock.restore();
return fs.rmdir(hexo.base_dir);
});

it('create()', function() {
var path = pathFn.join(hexo.source_dir, '_posts', 'Hello-World.md');
var date = moment(now);
var listener = sinon.spy();

var content = [
'title: Hello World',
'date: ' + date.format('YYYY-MM-DD HH:mm:ss'),
'tags:',
'---'
].join('\n') + '\n';

hexo.once('new', listener);

return post.create({
title: 'Hello World'
}).then(function(post) {
post.path.should.eql(path);
post.content.should.eql(content);
listener.calledOnce.should.be.true;

return fs.readFile(path);
}).then(function(data) {
