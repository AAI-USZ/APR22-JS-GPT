'use strict';

const { join } = require('path');
const { mkdirs, unlink, writeFile, rmdir } = require('hexo-fs');

describe('Load alternate theme config', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'config_test'), {silent: true});
const loadThemeConfig = require('../../../lib/hexo/load_theme_config');

hexo.env.init = true;

before(() => mkdirs(hexo.base_dir).then(() => hexo.init()));

after(() => rmdir(hexo.base_dir));

beforeEach(() => {
hexo.config.theme_config = { foo: { bar: 'ahhhhhh' } };
hexo.config.theme = 'test_theme';
});

it('hexo.config.theme does not exist', async () => {
hexo.config.theme = undefined;
await loadThemeConfig(hexo);
hexo.config.theme_config.foo.bar.should.eql('ahhhhhh');
hexo.config.theme_config = {};
});

it('_config.[theme].yml does not exist', () => loadThemeConfig(hexo).then(() => {
hexo.config.theme_config = {};
}));

