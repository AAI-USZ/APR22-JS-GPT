'use strict';

describe('Titlecase', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const titlecase = require('../../../lib/plugins/filter/before_post_render/titlecase').bind(hexo);

it('disabled', () => {
const title = 'Today is a good day';
const data = {title};
hexo.config.titlecase = false;

