'use strict';

const { join } = require('path');
const { mkdirs, rmdir, writeFile } = require('hexo-fs');

describe('Theme', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'theme_test'), {silent: true});
const themeDir = join(hexo.base_dir, 'themes', 'test');

before(async () => {
await Promise.all([
