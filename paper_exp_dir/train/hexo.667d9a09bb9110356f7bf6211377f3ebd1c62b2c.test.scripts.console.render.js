'use strict';

const { mkdirs, readFile, rmdir, unlink, writeFile } = require('hexo-fs');
const { join } = require('path');
const Promise = require('bluebird');

describe('render', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'render_test'), {silent: true});
const render = require('../../../lib/plugins/console/render').bind(hexo);

before(async () => {
await mkdirs(hexo.base_dir);
hexo.init();
});

after(() => rmdir(hexo.base_dir));

