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
data.content.should.eql('');
data.excerpt.should.eql('');
data.more.should.eql('');

return Post.removeById(data._id);
});
});

it('source - required', function(){
return Post.insert({}).catch(function(err){
