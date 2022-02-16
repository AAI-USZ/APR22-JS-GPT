'use strict';

const Promise = require('bluebird');

describe('page', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname, {silent: true});
const Page = hexo.model('Page');
const generator = Promise.method(require('../../../lib/plugins/generator/page').bind(hexo));

function locals() {
hexo.locals.invalidate();
return hexo.locals.toObject();
}

it('default layout', async () => {
const page = await Page.insert({
source: 'foo',
path: 'bar'
});
const data = await generator(locals());
page.__page = true;

data.should.eql([
{
