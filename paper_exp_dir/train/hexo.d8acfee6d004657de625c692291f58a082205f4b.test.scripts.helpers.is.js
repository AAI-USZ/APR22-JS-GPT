var should = require('chai').should();

describe('is', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var is = require('../../../lib/plugins/helper/is');

it('is_current', () => {
is.current.call({path: 'index.html', config: hexo.config}).should.be.true;
is.current.call({path: 'tags/index.html', config: hexo.config}).should.be.false;
is.current.call({path: 'index.html', config: hexo.config}, '/').should.be.true;
is.current.call({path: 'index.html', config: hexo.config}, 'index.html').should.be.true;
is.current.call({path: 'tags/index.html', config: hexo.config}, '/').should.be.false;
is.current.call({path: 'tags/index.html', config: hexo.config}, '/index.html').should.be.false;
is.current.call({path: 'index.html', config: hexo.config}, '/', true).should.be.true;
is.current.call({path: 'index.html', config: hexo.config}, '/index.html', true).should.be.true;
is.current.call({path: 'foo/bar', config: hexo.config}, 'foo', true).should.be.false;
is.current.call({path: 'foo/bar', config: hexo.config}, 'foo').should.be.true;
is.current.call({path: 'foo/bar', config: hexo.config}, 'foo/bar').should.be.true;
