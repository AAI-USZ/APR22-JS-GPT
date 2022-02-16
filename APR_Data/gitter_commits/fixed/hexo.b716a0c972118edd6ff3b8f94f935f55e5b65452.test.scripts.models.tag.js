var should = require('chai').should();
var Promise = require('bluebird');
var _ = require('lodash');

describe('Tag', function(){
  var Hexo = require('../../../lib/hexo');
  var hexo = new Hexo();
  var Tag = hexo.model('Tag');
  var Post = hexo.model('Post');
  var PostTag = hexo.model('PostTag');

  before(function(){
    return hexo.init();
  });

  it('name - required', function(){
    return Tag.insert({}).catch(function(err){
      err.should.have.property('message', '`name` is required!');
    });
  });

  it('slug - virtual', function(){
    return Tag.insert({
      name: 'foo'
    }).then(function(data){
      data.slug.should.eql('foo');
      return Tag.removeById(data._id);
    });
  });

  it('slug - tag_map', function(){
    hexo.config.tag_map = {
      test: 'wat'
    };

    return Tag.insert({
      name: 'test'
    }).then(function(data){
      data.slug.should.eql('wat');
      hexo.config.tag_map = {};

      return Tag.removeById(data._id);
    });
  });

  it('slug - filename_case: 0', function(){
    return Tag.insert({
      name: 'WahAHa'
    }).then(function(data){
      data.slug.should.eql('WahAHa');
      return Tag.removeById(data._id);
    });
  });

  it('slug - filename_case: 1', function(){
    hexo.config.filename_case = 1;

    return Tag.insert({
      name: 'WahAHa'
    }).then(function(data){
      data.slug.should.eql('wahaha');
      hexo.config.filename_case = 0;
      return Tag.removeById(data._id);
    });
  });

  it('slug - filename_case: 2', function(){
    hexo.config.filename_case = 2;

    return Tag.insert({
      name: 'WahAHa'
    }).then(function(data){
      data.slug.should.eql('WAHAHA');
      hexo.config.filename_case = 0;
      return Tag.removeById(data._id);
    });
  });

  it('path - virtual', function(){
    return Tag.insert({
      name: 'foo'
    }).then(function(data){
      data.path.should.eql(hexo.config.tag_dir + '/' + data.slug + '/');
      return Tag.removeById(data._id);
    })
  });

  it('permalink - virtual', function(){
    return Tag.insert({
      name: 'foo'
    }).then(function(data){
      data.permalink.should.eql(hexo.config.url + '/' + data.path);
      return Tag.removeById(data._id);
    });
  });

  it('posts - virtual', function(){
    return Post.insert([
      {source: 'foo.md', slug: 'foo', published: true},
      {source: 'bar.md', slug: 'bar', published: false},
      {source: 'baz.md', slug: 'baz', published: true}
    ]).then(function(posts){
      return Promise.map(posts, function(post){
        return post.setTags(['foo']).thenReturn(post);
      }, {concurrency: 1}); // One item a time
    }).then(function(posts){
      var tag = Tag.findOne({name: 'foo'});

      tag.posts.eq(0)._id.should.eql(posts[0]._id);
      tag.posts.eq(1)._id.should.eql(posts[2]._id);
      tag.length.should.eql(2);

      // draft visible
      hexo.config.render_drafts = true;
      tag = Tag.findOne({name: 'foo'});

      for (var i = 0, len = posts.length; i < len; i++){
        tag.posts.eq(i)._id.should.eql(posts[i]._id);
      }

      tag.length.should.eql(posts.length);
      hexo.config.render_drafts = false;

      return Tag.removeById(tag._id).thenReturn(posts);
    }).map(function(post){
      return Post.removeById(post._id);
    });
  });

  it('check whether a tag exists', function(){
    return Tag.insert({
      name: 'foo'
    }).then(function(data){
      Tag.insert({
        name: 'foo'
      }).catch(function(err){
        err.should.have.property('message', 'Tag `foo` has already existed!');
      });

      return Tag.removeById(data._id);
    });
  });

  it('remove PostTag references when a tag is removed', function(){
    var tag;

    return Post.insert([
      {source: 'foo.md', slug: 'foo'},
      {source: 'bar.md', slug: 'bar'},
      {source: 'baz.md', slug: 'baz'}
    ]).then(function(posts){
      return Promise.map(posts, function(post){
        return post.setTags(['foo']).thenReturn(post);
      }, {concurrency: 1}); // One item a time
    }).then(function(posts){
      tag = Tag.findOne({name: 'foo'});
      return Tag.removeById(tag._id).thenReturn(posts);
    }).then(function(posts){
      PostTag.find({tag_id: tag._id}).length.should.eql(0);
      return posts;
    }).map(function(post){
      return Post.removeById(post._id);
    });
  });
});