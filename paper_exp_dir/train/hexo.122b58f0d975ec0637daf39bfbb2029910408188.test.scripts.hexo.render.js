'use strict';

const { writeFile, rmdir } = require('hexo-fs');
const { join } = require('path');
const yaml = require('js-yaml');
const { spy, assert: sinonAssert } = require('sinon');

describe('Render', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'render_test'));

hexo.config.meta_generator = false;

const body = [
'name:',
'  first: John',
'  last: Doe',
'',
'age: 23',
'',
'list:',
'- Apple',
'- Banana'
].join('\n');

const obj = yaml.load(body);
const path = join(hexo.base_dir, 'test.yml');

before(async () => {
await writeFile(path, body);
await hexo.init();
});

after(() => rmdir(hexo.base_dir));

it('isRenderable()', () => {
hexo.render.isRenderable('test.txt').should.be.false;


hexo.render.isRenderable('test.htm').should.be.true;
