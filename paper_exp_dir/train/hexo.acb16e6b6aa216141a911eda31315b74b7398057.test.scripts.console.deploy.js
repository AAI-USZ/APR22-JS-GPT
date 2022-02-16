const should = require('chai').should();
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

it('single deploy setting', () => {
hexo.config.deploy = {
type: 'foo',
foo: 'bar'
};

const deployer = sinon.spy(args => {
args.should.eql({
type: 'foo',
foo: 'foo',
bar: 'bar'
});
});

const beforeListener = sinon.spy();
const afterListener = sinon.spy();
