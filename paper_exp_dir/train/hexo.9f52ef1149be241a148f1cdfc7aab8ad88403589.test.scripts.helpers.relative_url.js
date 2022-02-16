'use strict';

describe('relative_url', () => {
const relativeURL = require('../../../lib/plugins/helper/relative_url');

it('from root', () => {
relativeURL('', 'css/style.css').should.eql('css/style.css');
relativeURL('index.html', 'css/style.css').should.eql('css/style.css');
});

it('from same root', () => {
relativeURL('foo/', 'foo/style.css').should.eql('style.css');
