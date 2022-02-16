var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var defaultConfig = require('../../../lib/hexo/default_config');

var dateFormat = 'YYYY-MM-DD HH:mm:ss';
var newPostName = defaultConfig.new_post_name;

describe('post', function(){
var Hexo = require('../../../lib/hexo');
var baseDir = pathFn.join(__dirname, 'post_test');
var hexo = new Hexo(baseDir);
var post = require('../../../lib/plugins/processor/post');
var process = Promise.method(post.process.bind(hexo));
var pattern = post.pattern;
var source = hexo.source;
var File = source.File;
var PostAsset = hexo.model('PostAsset');
var Post = hexo.model('Post');

function newFile(options){
var path = options.path;

options.path = (options.published ? '_posts' : '_drafts') + '/' + path;
options.source = pathFn.join(source.base, options.path);

options.params = {
published: options.published,
path: path
};

return new File(options);
}

before(function(){
return fs.mkdirs(baseDir).then(function(){
return hexo.init();
});
});

after(function(){
return fs.rmdir(baseDir);
});

it('pattern', function(){
pattern.match('_posts/foo.html').should.eql({
published: true,
path: 'foo.html'
});

pattern.match('_drafts/bar.html').should.eql({
published: false,
path: 'bar.html'
});

pattern.match('_posts/foo.html~').should.be.false;
pattern.match('_posts/foo.html%').should.be.false;
pattern.match('_posts/_foo.html').should.be.false;
pattern.match('_posts/foo/_bar.html').should.be.false;
pattern.match('_foo/bar.html').should.be.false;
});

it('asset - post_asset_folder disabled', function(){
hexo.config.post_asset_folder = false;

var file = newFile({
path: 'foo/bar.jpg',
published: true,
type: 'create'
});

return process(file).then(function(){
var id = 'source/' + file.path;
should.not.exist(PostAsset.findById(id));
});
});

it('asset - type: create', function(){
hexo.config.post_asset_folder = true;

var file = newFile({
path: 'foo/bar.jpg',
published: true,
type: 'create'
});

var postId;

return Post.insert({
source: '_posts/foo.html',
slug: 'foo'
}).then(function(doc){
postId = doc._id;
return process(file);
}).then(function(){
hexo.config.post_asset_folder = false;

var id = 'source/' + file.path;
var asset = PostAsset.findById(id);

asset._id.should.eql(id);
asset.post.should.eql(postId);
asset.modified.should.be.true;

return Promise.all([
asset.remove(),
Post.removeById(postId)
]);
});
});

it('asset - type: update', function(){
hexo.config.post_asset_folder = true;

var file = newFile({
path: 'foo/bar.jpg',
published: true,
type: 'update'
});

var id = 'source/' + file.path;

return Post.insert({
source: '_posts/foo.html',
slug: 'foo'
}).then(function(post){
return PostAsset.insert({
_id: id,
slug: file.path,
modified: false,
post: post._id
});
}).then(function(){
return process(file);
}).then(function(){
hexo.config.post_asset_folder = false;

var asset = PostAsset.findById(id);
