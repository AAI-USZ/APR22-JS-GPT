'use strict';

const { join } = require('path');
const { mkdirs, rmdir, writeFile } = require('hexo-fs');
const moment = require('moment');
const { fake, assert: sinonAssert } = require('sinon');

describe('View', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'theme_test'));
const themeDir = join(hexo.base_dir, 'themes', 'test');
const { compile } = Object.assign({}, hexo.extend.renderer.store.njk);

hexo.env.init = true;

function newView(path, data) {
return new hexo.theme.View(path, data);
}

before(async () => {
await Promise.all([
mkdirs(themeDir),
writeFile(hexo.config_path, 'theme: test')
]);
await hexo.init();

hexo.theme.setView('layout.njk', [
'pre',
'{{ body }}',
'post'
].join('\n'));
});

beforeEach(() => {

hexo.extend.renderer.store.njk.compile = compile;
});

after(() => rmdir(hexo.base_dir));

it('constructor', () => {
const data = {
_content: ''
};
const view = newView('index.njk', data);

view.path.should.eql('index.njk');
view.source.should.eql(join(themeDir, 'layout', 'index.njk'));
view.data.should.eql(data);
});

it('parse front-matter', () => {
const body = [
'layout: false',
'---',
'content'
].join('\n');

const view = newView('index.njk', body);

view.data.should.eql({
layout: false,
_content: 'content'
});
});

it('precompile view if possible', async () => {
const body = 'Hello {{ name }}';
const view = newView('index.njk', body);

view._compiledSync({
name: 'Hexo'
}).should.eql('Hello Hexo');

const result = await view._compiled({
name: 'Hexo'
});
result.should.eql('Hello Hexo');
});

it('generate precompiled function even if renderer does not provide compile function', async () => {

delete hexo.extend.renderer.store.njk.compile;

const body = 'Hello {{ name }}';
const view = newView('index.njk', body);
