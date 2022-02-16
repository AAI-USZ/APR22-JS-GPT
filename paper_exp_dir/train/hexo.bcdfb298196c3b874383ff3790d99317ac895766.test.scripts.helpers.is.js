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
var paginationDir = hexo.config.pagination_dir;

is.home.call({path: '', config: hexo.config}).should.be.true;
is.home.call({path: paginationDir + '/2/', config: hexo.config}).should.be.true;
});

it('is_post', function(){
var config = {
permalink: ':id/:category/:year/:month/:day/:title'
};

is.post.call({path: '123/foo/bar/2013/08/12/foo-bar', config: config}).should.be.true;
});

it('is_archive', function(){
is.archive.call({}).should.be.false;
is.archive.call({archive: true}).should.be.true;
is.archive.call({archive: false}).should.be.false;
