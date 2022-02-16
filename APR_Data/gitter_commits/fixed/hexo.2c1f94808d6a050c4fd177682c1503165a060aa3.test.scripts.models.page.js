'use strict';

var should = require('chai').should();
var assert = require('chai').assert;
var pathFn = require('path');

describe('Page', function(){
  var Hexo = require('../../../lib/hexo');
  var hexo = new Hexo();
  var Page = hexo.model('Page');

  it('default values', function(){
    var now = Date.now();

    return Page.insert({
      source: 'foo',
      path: 'bar'
    }).then(function(data){
      data.title.should.eql('');
      data.date.valueOf().should.gte(now);
      data.updated.valueOf().should.gte(now);
      data.comments.should.be.true;
      data.layout.should.eql('page');
      data._content.should.eql('');
      data.raw.should.eql('');
      data.content.should.eql('');
      data.excerpt.should.eql('');
      data.more.should.eql('');

      return Page.removeById(data._id);
    });
  });

  it('source - required', function(){
    return Page.insert({}).then(function(){
      assert.fail();
    }).catch(function(err){
      err.should.have.property('message', '`source` is required!');
    });
  });

  it('path - required', function(){
    return Page.insert({
      source: 'foo'
    }).then(function(){
      assert.fail();
    }).catch(function(err){
      err.should.have.property('message', '`path` is required!');
    });
  });

  it('permalink - virtual', function(){
    return Page.insert({
      source: 'foo',
      path: 'bar'
    }).then(function(data){
      data.permalink.should.eql(hexo.config.url + '/' + data.path);
      return Page.removeById(data._id);
    });
  });

  it('full_source - virtual', function(){
    return Page.insert({
      source: 'foo',
      path: 'bar'
    }).then(function(data){
      data.full_source.should.eql(pathFn.join(hexo.source_dir, data.source));
      return Page.removeById(data._id);
    });
  });
});