'use strict';

describe('Excerpt', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const excerpt = require('../../../lib/plugins/filter/after_post_render/excerpt').bind(hexo);

it('without <!-- more -->', () => {
const content = [
'foo',
'bar',
'baz'
