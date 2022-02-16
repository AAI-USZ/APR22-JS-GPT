'use strict';

describe('image_tag', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);

const ctx = {
config: hexo.config
};

const img = require('../../../lib/plugins/helper/image_tag').bind(ctx);

it('path', () => {
img('https://hexo.io/image.jpg').should.eql('<img src="https://hexo.io/image.jpg">');
});

it('class (string)', () => {
img('https://hexo.io/image.jpg', {class: 'foo'})
.should.eql('<img src="https://hexo.io/image.jpg" class="foo">');
});

