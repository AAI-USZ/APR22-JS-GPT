'use strict';

const { exists, mkdirs, readFile, rmdir, writeFile } = require('hexo-fs');
const { join } = require('path');
const { spy, stub } = require('sinon');

describe('deploy', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'deploy_test'), { silent: true });
const deploy = require('../../../lib/plugins/console/deploy').bind(hexo);

before(async () => {
await mkdirs(hexo.public_dir);
hexo.init();
});

beforeEach(() => {
hexo.config.deploy = { type: 'foo' };
hexo.extend.deployer.register('foo', () => {});
});

after(() => rmdir(hexo.base_dir));

it('no deploy config', () => {
delete hexo.config.deploy;

const logStub = stub(console, 'log');

try {
should.not.exist(deploy({ test: true }));
} finally {
logStub.restore();
}

logStub.calledWithMatch(
'You should configure deployment settings in _config.yml first!'
).should.be.true;
});

it('single deploy setting', async () => {
hexo.config.deploy = {
type: 'foo',
foo: 'bar'
