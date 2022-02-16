'use strict';

describe('External link', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const externalLink = require('../../../lib/plugins/filter/after_post_render/external_link').bind(hexo);

hexo.config.external_link = true;
hexo.config.url = 'http://maji.moe';

it('disabled', () => {
const content = 'foo'
