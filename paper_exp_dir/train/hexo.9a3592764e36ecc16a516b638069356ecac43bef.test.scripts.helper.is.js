var should = require('chai').should();

describe('is', function(){
var is = require('../../../lib/plugins/helper/is');

it('is_current', function(){
is.is_current.call({path: 'foo/bar', config: hexo.config}, 'foo').should.be.true;
is.is_current.call({path: 'foo/bar', config: hexo.config}, 'foo/bar').should.be.true;
is.is_current.call({path: 'foo/bar', config: hexo.config}, 'foo/baz').should.be.false;
});

it('is_home', function(){
