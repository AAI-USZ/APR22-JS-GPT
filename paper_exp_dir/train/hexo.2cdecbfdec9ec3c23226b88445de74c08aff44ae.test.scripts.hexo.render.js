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

before(() => writeFile(path, body).then(() => hexo.init()));

after(() => rmdir(hexo.base_dir));

it('isRenderable()', () => {
hexo.render.isRenderable('test.txt').should.be.false;


hexo.render.isRenderable('test.htm').should.be.true;
hexo.render.isRenderable('test.html').should.be.true;


hexo.render.isRenderable('test.swig').should.be.false;
hexo.render.isRenderable('test.njk').should.be.true;


hexo.render.isRenderable('test.yml').should.be.true;
hexo.render.isRenderable('test.yaml').should.be.true;
});

it('isRenderableSync()', () => {
hexo.render.isRenderableSync('test.txt').should.be.false;


