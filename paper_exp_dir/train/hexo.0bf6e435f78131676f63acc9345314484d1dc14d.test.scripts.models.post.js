var should = require('chai').should();
var pathFn = require('path');
var Promise = require('bluebird');

describe('Post', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var Post = hexo.model('Post');
var Tag = hexo.model('Tag');
var Category = hexo.model('Category');
var PostTag = hexo.model('PostTag');
var PostCategory = hexo.model('PostCategory');
var Asset = hexo.model('Asset');

before(function(){
hexo.config.permalink = ':title';
return hexo.init();
});

it('default values', function(){
var now = Date.now();

return Post.insert({
source: 'foo.md',
slug: 'bar'
}).then(function(data){
data.title.should.eql('');
data.date.valueOf().should.gte(now);
data.updated.valueOf().should.gte(now);
data.comments.should.be.true;
data.layout.should.eql('post');
data._content.should.eql('');
data.link.should.eql('');
data.raw.should.eql('');
data.published.should.be.true;

return Post.removeById(data._id);
});
});

it('source - required', function(){
return Post.insert({}).catch(function(err){
err.should.have.property('message', '`source` is required!');
});
});

it('slug - required', function(){
return Post.insert({
source: 'foo.md'
}).catch(function(err){
err.should.have.property('message', '`slug` is required!');
});
});

it('path - virtual', function(){
return Post.insert({
source: 'foo.md',
slug: 'bar'
}).then(function(data){
data.path.should.eql(data.slug);
return Post.removeById(data._id);
});
});

it('permalink - virtual', function(){
return Post.insert({
source: 'foo.md',
slug: 'bar'
}).then(function(data){
data.permalink.should.eql(hexo.config.url + '/' + data.path);
return Post.removeById(data._id);
});
});

it('full_source - virtual', function(){
return Post.insert({
source: 'foo.md',
slug: 'bar'
}).then(function(data){
data.full_source.should.eql(pathFn.join(hexo.source_dir, data.source));
return Post.removeById(data._id);
});
});

it('asset_dir - virtual', function(){
return Post.insert({
source: 'foo.md',
slug: 'bar'
}).then(function(data){
data.asset_dir.should.eql(pathFn.join(hexo.source_dir, 'foo') + pathFn.sep);
return Post.removeById(data._id);
});
});

it('content - virtual', function(){
var content = [
'{% raw %}',
'123456',
'{% endraw %}'
].join('\n');

return Post.insert({
source: 'foo.md',
slug: 'bar',
_content: content
}).then(function(post){
post.content.should.eql('123456');
return Post.removeById(post._id);
});
});

it('excerpt / more - virtual (with more tag)', function(){
var content = [
'123456',
'<a id="more"></a>',
'789012'
].join('\n');

return Post.insert({
source: 'foo.md',
slug: 'bar',
_content: content
}).then(function(post){
post.excerpt.should.eql('123456');
post.more.should.eql('789012')
return Post.removeById(post._id);
});
});

it('excerpt / more - virtual (without more tag)', function(){
var content = '123456';

return Post.insert({
source: 'foo.md',
slug: 'bar',
_content: content
}).then(function(post){
post.excerpt.should.eql('');
post.more.should.eql('123456')
