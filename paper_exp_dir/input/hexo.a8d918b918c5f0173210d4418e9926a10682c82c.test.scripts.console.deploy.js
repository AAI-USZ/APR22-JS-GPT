'use strict';

const { exists, mkdirs, readFile, rmdir, writeFile } = require('hexo-fs');
const { join } = require('path');
const { spy, stub, assert: sinonAssert } = require('sinon');

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

sinonAssert.calledWithMatch(
logStub,
'You should configure deployment settings in _config.yml first!'
);
});

it('single deploy setting', async () => {
hexo.config.deploy = {
type: 'foo',
foo: 'bar'
};

const deployer = spy();
const beforeListener = spy();
const afterListener = spy();

hexo.once('deployBefore', beforeListener);
hexo.once('deployAfter', afterListener);
hexo.extend.deployer.register('foo', deployer);

await deploy({ foo: 'foo', bar: 'bar' });
deployer.calledOnce.should.be.true;
beforeListener.calledOnce.should.be.true;
afterListener.calledOnce.should.be.true;

sinonAssert.calledWith(deployer, {
type: 'foo',
foo: 'foo',
bar: 'bar'
});
});

it('multiple deploy setting', async () => {
const deployer1 = spy();
const deployer2 = spy();

hexo.config.deploy = [
