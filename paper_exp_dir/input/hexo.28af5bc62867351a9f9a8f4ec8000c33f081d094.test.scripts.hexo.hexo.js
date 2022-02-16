'use strict';

const { sep, join } = require('path');
const { mkdirs, rmdir, unlink, writeFile } = require('hexo-fs');
const Promise = require('bluebird');
const { spy } = require('sinon');
const testUtil = require('../../util');
const { full_url_for } = require('hexo-util');

describe('Hexo', () => {
const base_dir = join(__dirname, 'hexo_test');
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(base_dir, { silent: true });
const coreDir = join(__dirname, '../../..');
const { version } = require('../../../package.json');
const Post = hexo.model('Post');
const Page = hexo.model('Page');
const Data = hexo.model('Data');
const { route } = hexo;

async function checkStream(stream, expected) {
const data = await testUtil.stream.read(stream);
data.should.eql(expected);
}

function loadAssetGenerator() {
hexo.extend.generator.register('asset', require('../../../lib/plugins/generator/asset'));
}

before(async () => {
await mkdirs(hexo.base_dir);
await hexo.init();
});

beforeEach(() => {

hexo.extend.generator.store = {};

route.routes = {};
});

after(() => rmdir(hexo.base_dir));

hexo.extend.console.register('test', args => args);

it('constructor', () => {
const hexo = new Hexo(__dirname);


hexo.core_dir.should.eql(coreDir + sep);
hexo.lib_dir.should.eql(join(coreDir, 'lib') + sep);
hexo.version.should.eql(version);
hexo.base_dir.should.eql(__dirname + sep);
hexo.public_dir.should.eql(join(__dirname, 'public') + sep);
hexo.source_dir.should.eql(join(__dirname, 'source') + sep);
hexo.plugin_dir.should.eql(join(__dirname, 'node_modules') + sep);
hexo.script_dir.should.eql(join(__dirname, 'scripts') + sep);
hexo.scaffold_dir.should.eql(join(__dirname, 'scaffolds') + sep);

hexo.env.should.eql({
args: {},
debug: false,
safe: false,
silent: false,
env: process.env.NODE_ENV || 'development',
version,
cmd: '',
init: false
});
hexo.config_path.should.eql(join(__dirname, '_config.yml'));
});

it('constructs mutli-config', () => {
const configs = ['../../../fixtures/_config.json', '../../../fixtures/_config.json'];
const args = { _: [], config: configs.join(',') };
const hexo = new Hexo(base_dir, args);
hexo.config_path.should.eql(join(base_dir, '_multiconfig.yml'));
});

it('call()', async () => {
const data = await hexo.call('test', {foo: 'bar'});
data.should.eql({foo: 'bar'});
});

it('call() - callback', callback => {
hexo.call('test', { foo: 'bar' }, (err, data) => {
should.not.exist(err);
data.should.eql({ foo: 'bar' });

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

it('call() - console not registered', async () => {
try {
await hexo.call('nothing');
should.fail('Return value must be rejected');
} catch (err) {
err.should.property('message', 'Console `nothing` has not been registered yet!');
}
});

it('init()', async () => {
const hexo = new Hexo(join(__dirname, 'hexo_test'), {silent: true});
const hook = spy();

hexo.extend.filter.register('after_init', hook);

await hexo.init();
hook.calledOnce.should.be.true;
});



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

async function testLoad(path) {
const target = join(path, 'test.txt');
const body = 'test';

loadAssetGenerator();

await writeFile(target, body);
await hexo.load();
await checkStream(route.get('test.txt'), body);
await unlink(target);
}

it('load() - source', async () => await testLoad(hexo.source_dir));

it('load() - theme', async () => await testLoad(join(hexo.theme_dir, 'source')));


it('load() - merge theme config - deep clone', async () => {
const hexo = new Hexo(__dirname);
hexo.theme.config = { a: { b: 1, c: 2 } };
hexo.config.theme_config = { a: { b: 3 } };

await hexo.load();

const { config: themeConfig } = hexo.theme;

themeConfig.a.should.have.own.property('c');
themeConfig.a.b.should.eql(3);

const Locals = hexo._generateLocals();
const { theme: themeLocals } = new Locals();

themeLocals.a.should.have.own.property('c');
themeLocals.a.b.should.eql(3);
});

it('load() - merge theme config - null theme.config', async () => {
const hexo = new Hexo(__dirname);
hexo.theme.config = null;
hexo.config.theme_config = { c: 3 };

await hexo.load();

const { config: themeConfig } = hexo.theme;

themeConfig.should.have.own.property('c');
themeConfig.c.should.eql(3);

const Locals = hexo._generateLocals();
const { theme: themeLocals } = new Locals();

themeLocals.should.have.own.property('c');
themeLocals.c.should.eql(3);
});

async function testWatch(path) {
const target = join(path, 'test.txt');
const body = 'test';
const newBody = body + body;

loadAssetGenerator();

await writeFile(target, body);
await hexo.watch();
await checkStream(route.get('test.txt'), body);
await writeFile(target, newBody);
await Promise.delay(300);
await checkStream(route.get('test.txt'), newBody);
hexo.unwatch();
await unlink(target);
}

it('watch() - source', async () => await testWatch(hexo.source_dir));

it('watch() - theme', async () => await testWatch(join(hexo.theme_dir, 'source')));

