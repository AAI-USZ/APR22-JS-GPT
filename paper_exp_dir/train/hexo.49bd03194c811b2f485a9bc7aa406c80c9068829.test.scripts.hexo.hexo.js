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
