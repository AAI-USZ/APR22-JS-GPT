'use strict';

const qs = require('querystring');

describe('mail_to', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);

const ctx = {
config: hexo.config
};

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

const mailto = require('../../../lib/plugins/helper/mail_to').bind(ctx);

it('path', () => {
mailto('abc@example.com').should.eql('<a href="mailto:abc@example.com" title="abc@example.com">abc@example.com</a>');
});

