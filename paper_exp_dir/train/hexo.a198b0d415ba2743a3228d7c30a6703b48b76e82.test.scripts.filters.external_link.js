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
