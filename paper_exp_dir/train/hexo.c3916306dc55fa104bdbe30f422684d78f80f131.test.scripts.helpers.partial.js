'use strict';

const sinon = require('sinon');
const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');

describe('partial', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'partial_test'), {silent: true});
const themeDir = pathFn.join(hexo.base_dir, 'themes', 'test');
const viewDir = pathFn.join(themeDir, 'layout') + pathFn.sep;
const viewName = 'article.swig';

const ctx = {
site: hexo.locals,
config: hexo.config,
view_dir: viewDir,
filename: pathFn.join(viewDir, 'post', viewName),
foo: 'foo',
cache: true
};

ctx.fragment_cache = require('../../../lib/plugins/helper/fragment_cache')(hexo);

hexo.env.init = true;

const partial = require('../../../lib/plugins/helper/partial')(hexo).bind(ctx);

before(async () => {
await Promise.all([
fs.mkdirs(themeDir),
fs.writeFile(hexo.config_path, 'theme: test')
]);
await hexo.init();
hexo.theme.setView('widget/tag.swig', 'tag widget');
});

after(() => fs.rmdir(hexo.base_dir));

it('default', () => {
