'use strict';

describe('url_for', () => {
const ctx = {
config: {},
relative_url: require('../../../lib/plugins/helper/relative_url')
};

const urlFor = require('../../../lib/plugins/helper/url_for').bind(ctx);

it('should encode path', () => {
ctx.config.root = '/';
urlFor('fôo.html').should.eql('/f%C3%B4o.html');

ctx.config.root = '/fôo/';
urlFor('bár.html').should.eql('/f%C3%B4o/b%C3%A1r.html');
});

it('internal url (relative off)', () => {
ctx.config.root = '/';
urlFor('index.html').should.eql('/index.html');
