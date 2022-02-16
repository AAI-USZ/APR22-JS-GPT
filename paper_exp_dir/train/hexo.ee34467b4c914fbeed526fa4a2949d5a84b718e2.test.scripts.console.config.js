'use strict';

const { mkdirs, readFile, rmdir, unlink, writeFile } = require('hexo-fs');
const { join } = require('path');
const { load } = require('js-yaml');
const { stub } = require('sinon');

describe('config', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'config_test'), {silent: true});
const config = require('../../../lib/plugins/console/config').bind(hexo);

before(async () => {
await mkdirs(hexo.base_dir);
hexo.init();
