'use strict';

describe('is', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);
const is = require('../../../lib/plugins/helper/is');

it('is_current', () => {
is.current.call({path: 'index.html', config: hexo.config}).should.be.true;
is.current.call({path: 'tags/index.html', config: hexo.config}).should.be.false;
is.current.call({path: 'index.html', config: hexo.config}, '/').should.be.true;
is.current.call({path: 'index.html', config: hexo.config}, 'index.html').should.be.true;
