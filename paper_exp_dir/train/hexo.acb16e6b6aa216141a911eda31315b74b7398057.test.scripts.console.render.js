const should = require('chai').should();
const fs = require('hexo-fs');
const pathFn = require('path');
const Promise = require('bluebird');

describe('render', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'render_test'), {silent: true});
const render = require('../../../lib/plugins/console/render').bind(hexo);

before(() => fs.mkdirs(hexo.base_dir).then(() => hexo.init()));

after(() => fs.rmdir(hexo.base_dir));

const body = [
'foo: 1',
'bar:',
'  boo: 2'
].join('\n');

it('relative path', () => {
const src = pathFn.join(hexo.base_dir, 'test.yml');
const dest = pathFn.join(hexo.base_dir, 'result.json');
