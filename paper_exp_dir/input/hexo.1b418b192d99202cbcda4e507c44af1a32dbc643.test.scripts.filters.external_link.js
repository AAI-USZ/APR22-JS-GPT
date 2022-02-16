'use strict';

describe('External link', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const externalLink = require('../../../lib/plugins/filter/after_post_render/external_link').bind(hexo);

hexo.config.external_link = true;
hexo.config.url = 'http://maji.moe';

it('disabled', () => {
const content = 'foo'
+ 'bar';

const data = {content};
hexo.config.external_link = false;

externalLink(data);
data.content.should.eql(content);
hexo.config.external_link = true;
});

it('enabled', () => {
const content = [
'# External link test',
'1. External link',
'2. Internal link',
'<a href="/archives/foo.html">Link</a>',
'3. Ignore links have "target" attribute',
