'use strict';

var should = require('chai').should();
var fs = require('hexo-fs');
var pathFn = require('path');
var sinon = require('sinon');

describe('deploy', function() {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'deploy_test'), {silent: true});
var deploy = require('../../../lib/plugins/console/deploy').bind(hexo);

before(function() {
return fs.mkdirs(hexo.public_dir).then(function() {
return hexo.init();
});
});

beforeEach(function() {
hexo.config.deploy = {type: 'foo'};
hexo.extend.deployer.register('foo', function() {});
});

after(function() {
return fs.rmdir(hexo.base_dir);
});

it('single deploy setting', function() {
hexo.config.deploy = {
type: 'foo',
foo: 'bar'
};

var deployer = sinon.spy(function(args) {
args.should.eql({
type: 'foo',
foo: 'foo',
bar: 'bar'
});
});

var beforeListener = sinon.spy();
var afterListener = sinon.spy();

hexo.once('deployBefore', beforeListener);
hexo.once('deployAfter', afterListener);
hexo.extend.deployer.register('foo', deployer);

return deploy({foo: 'foo', bar: 'bar'}).then(function() {
deployer.calledOnce.should.be.true;
beforeListener.calledOnce.should.be.true;
afterListener.calledOnce.should.be.true;
});
});

it('multiple deploy setting', function() {
