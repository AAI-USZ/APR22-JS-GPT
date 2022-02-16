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
var paginationDir = hexo.config.pagination_dir;

is.home.call({path: '', config: hexo.config, page: {}}).should.be.true;
is.home.call({path: paginationDir + '/2/', config: hexo.config, page: {}}).should.be.true;
is.home.call({path: 'index.html', config: hexo.config, page: {}}).should.be.true;
is.home.call({path: paginationDir + '/2/index.html', config: hexo.config, page: {}}).should.be.true;

is.home.call({
path: 'zh-tw/index.html',
config: hexo.config,
page: {canonical_path: 'index.html'}
}).should.be.true;
