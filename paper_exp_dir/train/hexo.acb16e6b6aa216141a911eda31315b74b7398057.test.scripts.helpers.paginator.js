const should = require('chai').should();

describe('paginator', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);

const ctx = {
page: {
base: '',
total: 10
},
site: hexo.locals,
config: hexo.config
};

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

const paginator = require('../../../lib/plugins/helper/paginator').bind(ctx);

function link(i) {
return ctx.url_for(i === 1 ? '' : 'page/' + i + '/');
}

function checkResult(result, data) {
let expected = '';
const current = data.current;
const total = data.total;
const pages = data.pages;
const space = data.space || '&hellip;';
