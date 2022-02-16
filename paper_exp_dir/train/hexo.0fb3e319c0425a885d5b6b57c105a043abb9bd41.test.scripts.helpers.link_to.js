'use strict';

describe('link_to', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);

const ctx = {
config: hexo.config
};

const linkTo = require('../../../lib/plugins/helper/link_to').bind(ctx);

it('path', () => {
linkTo('https://hexo.io/').should.eql('<a href="https://hexo.io/" title="hexo.io">hexo.io</a>');
});

it('title', () => {
linkTo('https://hexo.io/', 'Hexo').should.eql('<a href="https://hexo.io/" title="Hexo">Hexo</a>');
});

it('external (boolean)', () => {
