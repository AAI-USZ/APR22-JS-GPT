'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');
const sinon = require('sinon');
const sep = pathFn.sep;
const testUtil = require('../../util');
const { full_url_for } = require('hexo-util');

describe('Hexo', () => {
const base_dir = pathFn.join(__dirname, 'hexo_test');
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(base_dir, {silent: true});
const coreDir = pathFn.join(__dirname, '../../..');
const version = require('../../../package.json').version;
const Post = hexo.model('Post');
const Page = hexo.model('Page');
const Data = hexo.model('Data');
const route = hexo.route;

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
const hexo = new Hexo(__dirname);


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
cmd: '',
init: false
});
hexo.config_path.should.eql(pathFn.join(__dirname, '_config.yml'));
});

it('constructs mutli-config', () => {
const configs = ['../../../fixtures/_config.json', '../../../fixtures/_config.json'];
const args = { _: [], config: configs.join(',') };
const hexo = new Hexo(base_dir, args);
hexo.config_path.should.eql(pathFn.join(base_dir, '_multiconfig.yml'));
});


it('theme_config - deep clone', () => {
const hexo = new Hexo(__dirname);
hexo.theme.config = { a: { b: 1, c: 2 } };
hexo.config.theme_config = { a: { b: 3 } };
