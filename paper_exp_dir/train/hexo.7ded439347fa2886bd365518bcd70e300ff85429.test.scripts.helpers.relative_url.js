'use strict';

require('chai').should();

describe('relative_url', () => {
const relativeURL = require('../../../lib/plugins/helper/relative_url');

it('from root', () => {
relativeURL('', 'css/style.css').should.eql('css/style.css');
relativeURL('index.html', 'css/style.css').should.eql('css/style.css');
});
