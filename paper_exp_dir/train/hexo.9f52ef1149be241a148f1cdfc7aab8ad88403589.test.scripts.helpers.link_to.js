'use strict';

describe('link_to', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);

const ctx = {
config: hexo.config
};

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

const linkTo = require('../../../lib/plugins/helper/link_to').bind(ctx);
