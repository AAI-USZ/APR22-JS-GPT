'use strict';

var should = require('chai').should();

describe('is', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var is = require('../../../lib/plugins/helper/is');

it('is_current', function(){
is.current.call({path: 'foo/bar', config: hexo.config}, 'foo').should.be.true;
is.current.call({path: 'foo/bar', config: hexo.config}, 'foo/bar').should.be.true;
is.current.call({path: 'foo/bar', config: hexo.config}, 'foo/baz').should.be.false;
});

it('is_home', function(){
is.home.call({page: {__index: true}}).should.be.true;
is.home.call({page: {}}).should.be.false;
});

it('is_post', function(){
is.post.call({page: {__post: true}}).should.be.true;
is.post.call({page: {}}).should.be.false;
});

it('is_page', function(){
