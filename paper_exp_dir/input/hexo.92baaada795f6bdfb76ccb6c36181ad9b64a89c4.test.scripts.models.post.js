var should = require('chai').should();
var sinon = require('sinon');
var pathFn = require('path');
var Promise = require('bluebird');

describe('Post', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var Post = hexo.model('Post');
var Tag = hexo.model('Tag');
var Category = hexo.model('Category');
var PostTag = hexo.model('PostTag');
var PostCategory = hexo.model('PostCategory');
var Asset = hexo.model('Asset');

before(() => {
hexo.config.permalink = ':title';
return hexo.init();
});

it('default values', () => {
var now = Date.now();

return Post.insert({
source: 'foo.md',
slug: 'bar'
}).then(data => {
data.title.should.eql('');
data.date.valueOf().should.gte(now);
data.updated.valueOf().should.gte(now);
data.comments.should.be.true;
data.layout.should.eql('post');
data._content.should.eql('');
data.link.should.eql('');
data.raw.should.eql('');
data.published.should.be.true;
should.not.exist(data.content);
should.not.exist(data.excerpt);
should.not.exist(data.more);

return Post.removeById(data._id);
});
});

it('source - required', () => {
var errorCallback = sinon.spy(err => {
err.should.have.property('message', '`source` is required!');
});

return Post.insert({}).catch(errorCallback).finally(() => {
errorCallback.calledOnce.should.be.true;
});
});

it('slug - required', () => {
var errorCallback = sinon.spy(err => {
err.should.have.property('message', '`slug` is required!');
});

return Post.insert({
source: 'foo.md'
}).catch(errorCallback).finally(() => {
errorCallback.calledOnce.should.be.true;
});
});

it('path - virtual', () => Post.insert({
source: 'foo.md',
slug: 'bar'
}).then(data => {
data.path.should.eql(data.slug);
return Post.removeById(data._id);
}));

it('permalink - virtual', () => {
hexo.config.root = '/';
return Post.insert({
source: 'foo.md',
slug: 'bar'
}).then(data => {
data.permalink.should.eql(hexo.config.url + '/' + data.path);
return Post.removeById(data._id);
});
});

it('permalink - virtual - when set relative_link', () => {
hexo.config.root = '/';
hexo.config.relative_link = true;
return Post.insert({
source: 'foo.md',
slug: 'bar'
}).then(data => {
data.permalink.should.eql(hexo.config.url + '/' + data.path);
return Post.removeById(data._id);
});
});

it('permalink_root_prefix - virtual', () => {
hexo.config.url = 'http://yoursite.com/root';
hexo.config.root = '/root/';
return Post.insert({
source: 'foo.md',
slug: 'bar'
}).then(data => {
data.permalink.should.eql('http://yoursite.com/root/' + data.path);
return Post.removeById(data._id);
});
});

it('permalink_root_prefix - virtual - when set relative_link', () => {
hexo.config.url = 'http://yoursite.com/root';
hexo.config.root = '/root/';
hexo.config.relative_link = true;
return Post.insert({
source: 'foo.md',
slug: 'bar'
}).then(data => {
data.permalink.should.eql(hexo.config.url + '/' + data.path);
return Post.removeById(data._id);
});
});

it('full_source - virtual', () => Post.insert({
source: 'foo.md',
slug: 'bar'
}).then(data => {
data.full_source.should.eql(pathFn.join(hexo.source_dir, data.source));
return Post.removeById(data._id);
}));

it('asset_dir - virtual', () => Post.insert({
source: 'foo.md',
slug: 'bar'
}).then(data => {
data.asset_dir.should.eql(pathFn.join(hexo.source_dir, 'foo') + pathFn.sep);
return Post.removeById(data._id);
}));

it('tags - virtual', () => Post.insert({
source: 'foo.md',
slug: 'bar'
}).then(post => post.setTags(['foo', 'bar', 'baz'])
.thenReturn(Post.findById(post._id))).then(post => {
post.tags.map(tag => tag.name).should.have.members(['bar', 'baz', 'foo']);

return Post.removeById(post._id);
}));

it('categories - virtual', () => Post.insert({
source: 'foo.md',
slug: 'bar'
}).then(post => post.setCategories(['foo', 'bar', 'baz'])
.thenReturn(Post.findById(post._id))).then(post => {
var cats = post.categories;


cats.map((cat, i) => {

if (i) {
cat.parent.should.eql(cats.eq(i - 1)._id);
} else {
should.not.exist(cat.parent);
}

return cat.name;
}).should.eql(['foo', 'bar', 'baz']);

return Post.removeById(post._id);
}));

it('setTags() - old tags should be removed', () => {
var id;

return Post.insert({
source: 'foo.md',
slug: 'foo'
}).then(post => {
id = post._id;
return post.setTags(['foo', 'bar']);
}).then(() => {
var post = Post.findById(id);
return post.setTags(['bar', 'baz']);
}).then(() => {
var post = Post.findById(id);

post.tags.map(tag => tag.name).should.eql(['bar', 'baz']);

return Post.removeById(id);
});
});

it('setTags() - sync problem', () => Post.insert([
{source: 'foo.md', slug: 'foo'},
{source: 'bar.md', slug: 'bar'}
]).then(posts => Promise.all([
posts[0].setTags(['foo', 'bar']),
posts[1].setTags(['bar', 'baz'])
]).thenReturn(posts)).then(posts => {
Tag.map(tag => tag.name).should.have.members(['foo', 'bar', 'baz']);

return posts;
}).map(post => Post.removeById(post._id)));

it('setTags() - empty tag', () => {
var id;

return Post.insert({
source: 'foo.md',
slug: 'foo'
}).then(post => {
id = post._id;
return post.setTags(['', undefined, null, false, 0, 'normal']);
}).then(() => {
var post = Post.findById(id);

post.tags.map(tag => tag.name).should.eql(['false', '0', 'normal']);
}).finally(() => Post.removeById(id));
});

it('setCategories() - old categories should be removed', () => {
var id;

return Post.insert({
source: 'foo.md',
slug: 'foo'
}).then(post => {
id = post._id;
return post.setCategories(['foo', 'bar']);
}).then(() => {
var post = Post.findById(id);
return post.setCategories(['foo', 'baz']);
}).then(() => {
var post = Post.findById(id);

post.categories.map(cat => cat.name).should.eql(['foo', 'baz']);

return Post.removeById(id);
});
});

it('setCategories() - shared category should be same', () => {

return Post.insert({
source: 'foo.md',
slug: 'foo'
}).then(post => {
postIdA = post._id;
return post.setCategories(['foo', 'bar']);
}).then(() => Post.insert({
source: 'bar.md',
slug: 'bar'
}).then(post => {
postIdB = post._id;
return post.setCategories(['foo', 'bar']);
})).then(() => {
var postA = Post.findById(postIdA);
var postB = Post.findById(postIdB);

postA.categories.map(cat => cat._id).should.eql(postB.categories.map(cat => cat._id));

return Promise.all([
Post.removeById(postIdA),
Post.removeById(postIdB)
]);
});
});

it('setCategories() - category not shared should be different', () => {
