const should = require('chai').should();
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

it('text', () => {
mailto('abc@example.com', 'Email').should.eql('<a href="mailto:abc@example.com" title="Email">Email</a>');
});

it('subject', () => {
mailto('abc@example.com', 'Email', {subject: 'Hello'})
.should.eql('<a href="mailto:abc@example.com?subject=Hello" title="Email">Email</a>');
});

it('cc (string)', () => {
const data = {cc: 'abc@abc.com'};
const querystring = qs.stringify(data);

mailto('abc@example.com', 'Email', {cc: 'abc@abc.com'})
.should.eql('<a href="mailto:abc@example.com?' + querystring + '" title="Email">Email</a>');
});

it('cc (array)', () => {
const data = {cc: 'abc@abc.com,bcd@bcd.com'};
const querystring = qs.stringify(data);
