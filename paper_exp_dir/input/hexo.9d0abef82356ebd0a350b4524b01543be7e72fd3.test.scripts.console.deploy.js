'use strict';

const fs = require('hexo-fs');
const pathFn = require('path');
const sinon = require('sinon');

describe('deploy', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'deploy_test'), {silent: true});
const deploy = require('../../../lib/plugins/console/deploy').bind(hexo);

before(() => fs.mkdirs(hexo.public_dir).then(() => hexo.init()));

beforeEach(() => {
hexo.config.deploy = {type: 'foo'};
hexo.extend.deployer.register('foo', () => {});
});

after(() => fs.rmdir(hexo.base_dir));

