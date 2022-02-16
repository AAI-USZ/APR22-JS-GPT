'use strict';

describe('url_for', () => {
const ctx = {
config: {},
relative_url: require('../../../lib/plugins/helper/relative_url')
};

const urlFor = require('../../../lib/plugins/helper/url_for').bind(ctx);

it('internal url (relative off)', () => {
ctx.config.root = '/';
urlFor('index.html').should.eql('/index.html');
