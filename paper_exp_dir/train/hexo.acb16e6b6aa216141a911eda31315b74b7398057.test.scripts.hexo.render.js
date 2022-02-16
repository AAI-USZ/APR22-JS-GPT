'use strict';

const fs = require('hexo-fs');
const pathFn = require('path');
const yaml = require('js-yaml');
const sinon = require('sinon');

describe('Render', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'render_test'));

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
const path = pathFn.join(hexo.base_dir, 'test.yml');

before(() => fs.writeFile(path, body).then(() => hexo.init()));

after(() => fs.rmdir(hexo.base_dir));

it('isRenderable()', () => {
hexo.render.isRenderable('test.txt').should.be.false;


hexo.render.isRenderable('test.htm').should.be.true;
hexo.render.isRenderable('test.html').should.be.true;


hexo.render.isRenderable('test.swig').should.be.true;


hexo.render.isRenderable('test.yml').should.be.true;
hexo.render.isRenderable('test.yaml').should.be.true;
});

it('isRenderableSync()', () => {
hexo.render.isRenderableSync('test.txt').should.be.false;


hexo.render.isRenderableSync('test.htm').should.be.true;
hexo.render.isRenderableSync('test.html').should.be.true;


hexo.render.isRenderableSync('test.swig').should.be.true;


hexo.render.isRenderableSync('test.yml').should.be.true;
hexo.render.isRenderableSync('test.yaml').should.be.true;
});

it('getOutput()', () => {
hexo.render.getOutput('test.txt').should.not.ok;


hexo.render.getOutput('test.htm').should.eql('html');
hexo.render.getOutput('test.html').should.eql('html');


hexo.render.getOutput('test.swig').should.eql('html');


hexo.render.getOutput('test.yml').should.eql('json');
hexo.render.getOutput('test.yaml').should.eql('json');
});

it('render() - path', () => hexo.render.render({path}).then(result => {
result.should.eql(obj);
}));

it('render() - text (without engine)', () => hexo.render.render({text: body}).then(result => {
result.should.eql(body);
}));

it('render() - text (with engine)', () => hexo.render.render({text: body, engine: 'yaml'}).then(result => {
result.should.eql(obj);
}));

it('render() - no path and text', () => {
const errorCallback = sinon.spy(err => {
