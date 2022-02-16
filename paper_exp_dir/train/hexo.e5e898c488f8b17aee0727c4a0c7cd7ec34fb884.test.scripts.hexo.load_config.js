'use strict';

const { join, sep, resolve } = require('path');
const { writeFile, unlink, mkdirs, rmdir } = require('hexo-fs');
const { makeRe } = require('micromatch');

describe('Load config', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'config_test'), { silent: true });
const loadConfig = require('../../../lib/hexo/load_config');
const defaultConfig = require('../../../lib/hexo/default_config');

hexo.env.init = true;

before(() => mkdirs(hexo.base_dir).then(() => hexo.init()));

after(() => rmdir(hexo.base_dir));

beforeEach(() => {
hexo.config = JSON.parse(JSON.stringify(defaultConfig));
});

it('config file does not exist', async () => {
await loadConfig(hexo);
hexo.config.should.eql(defaultConfig);
});

