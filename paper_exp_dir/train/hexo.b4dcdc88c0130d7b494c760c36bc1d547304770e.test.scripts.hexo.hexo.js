var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var sinon = require('sinon');
var sep = pathFn.sep;
var testUtil = require('../../util');

describe('Hexo', () => {
var base_dir = pathFn.join(__dirname, 'hexo_test');
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(base_dir, {silent: true});
var coreDir = pathFn.join(__dirname, '../../..');
var version = require('../../../package.json').version;
var Post = hexo.model('Post');
var Page = hexo.model('Page');
var Data = hexo.model('Data');
var route = hexo.route;

function checkStream(stream, expected) {
return testUtil.stream.read(stream).then(data => {
data.should.eql(expected);
});
}

function loadAssetGenerator() {
hexo.extend.generator.register('asset', require('../../../lib/plugins/generator/asset'));
}

before(() => fs.mkdirs(hexo.base_dir).then(() => hexo.init()));

beforeEach(() => {

hexo.extend.generator.store = {};

route.routes = {};
});

after(() => fs.rmdir(hexo.base_dir));

hexo.extend.console.register('test', args => args);

it('constructor', () => {
var hexo = new Hexo(__dirname);


hexo.core_dir.should.eql(coreDir + sep);
hexo.lib_dir.should.eql(pathFn.join(coreDir, 'lib') + sep);
hexo.version.should.eql(version);
hexo.base_dir.should.eql(__dirname + sep);
hexo.public_dir.should.eql(pathFn.join(__dirname, 'public') + sep);
hexo.source_dir.should.eql(pathFn.join(__dirname, 'source') + sep);
hexo.plugin_dir.should.eql(pathFn.join(__dirname, 'node_modules') + sep);
hexo.script_dir.should.eql(pathFn.join(__dirname, 'scripts') + sep);
hexo.scaffold_dir.should.eql(pathFn.join(__dirname, 'scaffolds') + sep);

hexo.env.should.eql({
args: {},
debug: false,
safe: false,
silent: false,
env: process.env.NODE_ENV || 'development',
version,
init: false
});
hexo.config_path.should.eql(pathFn.join(__dirname, '_config.yml'));
});

it('constructs mutli-config', () => {
var configs = [ '../../../fixtures/_config.json', '../../../fixtures/_config.json' ];
var args = { _: [], config: configs.join(',') };
var hexo = new Hexo(base_dir, args);
hexo.config_path.should.eql(pathFn.join(base_dir, '_multiconfig.yml'));
});

it('call()', () => hexo.call('test', {foo: 'bar'}).then(data => {
data.should.eql({foo: 'bar'});
}));

it('call() - callback', callback => {
hexo.call('test', {foo: 'bar'}, (err, data) => {
should.not.exist(err);
data.should.eql({foo: 'bar'});

callback();
});
});

it('call() - callback without args', callback => {
hexo.call('test', (err, data) => {
should.not.exist(err);
data.should.eql({});

callback();
});
});

it('call() - console not registered', () => {
var errorCallback = sinon.spy(err => {
err.should.have.property('message', 'Console `nothing` has not been registered yet!');
});

return hexo.call('nothing').catch(errorCallback).finally(() => {
errorCallback.calledOnce.should.be.true;
});
});

it('init()', () => {
var hexo = new Hexo(pathFn.join(__dirname, 'hexo_test'), {silent: true});
var hook = sinon.spy();

hexo.extend.filter.register('after_init', hook);

return hexo.init().then(() => {
hook.calledOnce.should.be.true;
});
});

it('model()');

it('_showDrafts()', () => {
hexo._showDrafts().should.be.false;

hexo.env.args.draft = true;
hexo._showDrafts().should.be.true;
hexo.env.args.draft = false;

hexo.env.args.drafts = true;
hexo._showDrafts().should.be.true;
hexo.env.args.drafts = false;

hexo.config.render_drafts = true;
hexo._showDrafts().should.be.true;
hexo.config.render_drafts = false;
});

function testLoad(path) {
var target = pathFn.join(path, 'test.txt');
var body = 'test';

loadAssetGenerator();

return fs.writeFile(target, body).then(() => hexo.load()).then(() => checkStream(route.get('test.txt'), body)).then(() => fs.unlink(target));
}

it('load() - source', () => testLoad(hexo.source_dir));

it('load() - theme', () => testLoad(pathFn.join(hexo.theme_dir, 'source')));

function testWatch(path) {
var target = pathFn.join(path, 'test.txt');
var body = 'test';
var newBody = body + body;

loadAssetGenerator();

return fs.writeFile(target, body).then(() => hexo.watch()).then(() =>
checkStream(route.get('test.txt'), body)).then(() =>
fs.writeFile(target, newBody)).delay(300).then(() =>
checkStream(route.get('test.txt'), newBody)).then(() =>
hexo.unwatch()).then(() =>
fs.unlink(target));
}

it('watch() - source', () => testWatch(hexo.source_dir));

it('watch() - theme', () => testWatch(pathFn.join(hexo.theme_dir, 'source')));

it('unwatch()');

it('exit()', () => {
var hook = sinon.spy();
var listener = sinon.spy();

hexo.extend.filter.register('before_exit', hook);
hexo.once('exit', listener);

return hexo.exit().then(() => {
hook.calledOnce.should.be.true;
listener.calledOnce.should.be.true;
});
});

it('exit() - error handling - callback', callback => {
hexo.once('exit', err => {
err.should.eql({foo: 'bar'});
callback();
});

hexo.exit({foo: 'bar'});
});

it('exit() - error handling - promise', () => {
return Promise.all([
hexo.exit({foo: 'bar'}),
new Promise((resolve, reject) => {
hexo.once('exit', err => {
try {
err.should.eql({foo: 'bar'});
resolve();
