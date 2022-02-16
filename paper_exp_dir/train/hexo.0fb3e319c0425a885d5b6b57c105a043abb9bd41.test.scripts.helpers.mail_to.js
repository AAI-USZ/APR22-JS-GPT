'use strict';

const qs = require('querystring');

describe('mail_to', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);

const ctx = {
config: hexo.config
};

const mailto = require('../../../lib/plugins/helper/mail_to').bind(ctx);

it('path', () => {
mailto('abc@example.com').should.eql('<a href="mailto:abc@example.com" title="abc@example.com">abc@example.com</a>');
});

it('path - array', () => {
const emails = ['abc@example.com', 'foo@example.com'];
const emailsStr = 'abc@example.com,foo@example.com';
mailto(emails).should.eql(`<a href="mailto:${emailsStr}" title="${emailsStr}">${emailsStr}</a>`);
});
