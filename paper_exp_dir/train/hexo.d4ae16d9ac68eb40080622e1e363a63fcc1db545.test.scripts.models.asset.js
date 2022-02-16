'use strict';

const { join } = require('path');

describe('Asset', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const Asset = hexo.model('Asset');

it('default values', async () => {
const data = await Asset.insert({
_id: 'foo',
path: 'bar'
});
