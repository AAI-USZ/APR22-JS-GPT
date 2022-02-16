'use strict';

describe('External link', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const externalLink = require('../../../lib/plugins/filter/after_render/external_link').bind(hexo);

hexo.config = {
url: 'https://example.com',
external_link: {
enable: true,
field: 'site',
exclude: ''
}
};

it('disabled', () => {
const content = 'foo'
+ '<a href="https://hexo.io/">Hexo</a>'
+ 'bar';

hexo.config.external_link.enable = false;

should.equal(externalLink(content), undefined);
hexo.config.external_link.enable = true;
});

it('field is post', () => {
const content = 'foo'
+ '<a href="https://hexo.io/">Hexo</a>'
+ 'bar';

hexo.config.external_link.field = 'post';
