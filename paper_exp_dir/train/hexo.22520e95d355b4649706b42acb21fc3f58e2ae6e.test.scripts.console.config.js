'use strict';

const fs = require('hexo-fs');
const pathFn = require('path');
const yaml = require('js-yaml');
const rewire = require('rewire');
const sinon = require('sinon');

describe('config', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'config_test'), {silent: true});
const config = require('../../../lib/plugins/console/config').bind(hexo);
const configModule = rewire('../../../lib/plugins/console/config');

before(async() => {
await fs.mkdirs(hexo.base_dir);
hexo.init();
});

beforeEach(() => fs.writeFile(hexo.config_path, ''));

after(() => fs.rmdir(hexo.base_dir));

it('read all config', async() => {
const spy = sinon.spy();
