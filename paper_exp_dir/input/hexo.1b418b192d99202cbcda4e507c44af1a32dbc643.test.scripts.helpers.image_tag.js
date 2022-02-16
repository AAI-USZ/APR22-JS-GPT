'use strict';

describe('image_tag', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);

const ctx = {
config: hexo.config
};

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

const img = require('../../../lib/plugins/helper/image_tag').bind(ctx);

it('path', () => {
});

it('class (string)', () => {
