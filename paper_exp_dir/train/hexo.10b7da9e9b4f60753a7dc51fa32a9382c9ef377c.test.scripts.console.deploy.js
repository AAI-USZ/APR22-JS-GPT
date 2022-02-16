'use strict';

const { exists, mkdirs, readFile, rmdir, writeFile } = require('hexo-fs');
const { join } = require('path');
const { spy } = require('sinon');

describe('deploy', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'deploy_test'), { silent: true });
const deploy = require('../../../lib/plugins/console/deploy').bind(hexo);

before(async () => {
await mkdirs(hexo.public_dir);
hexo.init();
});

beforeEach(() => {
