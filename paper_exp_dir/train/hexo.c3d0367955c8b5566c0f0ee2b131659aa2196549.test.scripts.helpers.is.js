'use strict';

describe('is', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const is = require('../../../lib/plugins/helper/is');

it('is_current', async () => {
await is.current.call({path: 'index.html', config: hexo.config}).should.be.true;
await is.current.call({path: 'tags/index.html', config: hexo.config}).should.be.false;
await is.current.call({path: 'index.html', config: hexo.config}, '/').should.be.true;
await is.current.call({path: 'index.html', config: hexo.config}, 'index.html').should.be.true;
await is.current.call({path: 'tags/index.html', config: hexo.config}, '/').should.be.false;
await is.current.call({path: 'tags/index.html', config: hexo.config}, '/index.html').should.be.false;
await is.current.call({path: 'index.html', config: hexo.config}, '/', true).should.be.true;
await is.current.call({path: 'index.html', config: hexo.config}, '/index.html', true).should.be.true;
await is.current.call({path: 'foo/bar', config: hexo.config}, 'foo', true).should.be.false;
await is.current.call({path: 'foo/bar', config: hexo.config}, 'foo').should.be.true;
