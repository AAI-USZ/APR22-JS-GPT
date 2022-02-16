var should = require('chai').should();

describe('search_form', () => {
var searchForm = require('../../../lib/plugins/helper/search_form').bind({
config: {url: 'http://hexo.io'}
});

it('default', () => {
