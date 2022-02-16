'use strict';

describe('External link', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const externalLink = require('../../../lib/plugins/filter/after_render/external_link').bind(hexo);
console.log(typeof externalLink);

hexo.config.external_link = true;
hexo.config.url = 'https://example.com';

it('disabled', () => {
const content = 'foo'
+ '<a href="https://hexo.io/">Hexo</a>'
+ 'bar';
