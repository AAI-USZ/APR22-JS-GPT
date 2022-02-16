'use strict';

require('chai').should();

describe('search_form', () => {
const searchForm = require('../../../lib/plugins/helper/search_form').bind({
config: {url: 'http://hexo.io'}
});

it('default', () => {
searchForm().should.eql('<form action="//google.com/search" method="get" accept-charset="UTF-8" class="search-form">'
