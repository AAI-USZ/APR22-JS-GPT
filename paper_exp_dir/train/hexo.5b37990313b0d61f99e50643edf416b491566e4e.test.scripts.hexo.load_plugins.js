'use strict';

const fs = require('hexo-fs');
const { join, dirname } = require('path');
const Promise = require('bluebird');

describe('Load plugins', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'plugin_test'), { silent: true });
const loadPlugins = require('../../../lib/hexo/load_plugins');

const script = [
'hexo._script_test = {',
'  filename: __filename,',
'  dirname: __dirname,',
'  module: module,',
'  require: require',
'}'
].join('\n');

function validate(path) {
const result = hexo._script_test;

result.filename.should.eql(path);
result.dirname.should.eql(dirname(path));
result.module.id.should.eql(path);
result.module.filename.should.eql(path);

delete hexo._script_test;
}

function createPackageFile(...args) {
const pkg = {
name: 'hexo-site',
version: '0.0.0',
private: true,
dependencies: {}
};

for (const arg of args) {
pkg.dependencies[arg] = '*';
}

return fs.writeFile(join(hexo.base_dir, 'package.json'), JSON.stringify(pkg, null, '  '));
}

function createPackageFileWithDevDeps(...args) {
const pkg = {
name: 'hexo-site',
version: '0.0.0',
private: true,
dependencies: {},
devDependencies: {}
};

for (let i = 0, len = args.length; i < len; i++) {
pkg.devDependencies[args[i]] = '*';
}

return fs.writeFile(join(hexo.base_dir, 'package.json'), JSON.stringify(pkg, null, '  '));
}

hexo.env.init = true;
hexo.theme_script_dir = join(hexo.base_dir, 'themes', 'test', 'scripts');

before(() => fs.mkdir(hexo.base_dir));

after(() => fs.rmdir(hexo.base_dir));

it('load plugins', () => {
const name = 'hexo-plugin-test';
const path = join(hexo.plugin_dir, name, 'index.js');

return Promise.all([
createPackageFile(name),
fs.writeFile(path, script)
]).then(() => loadPlugins(hexo)).then(() => {
validate(path);
return fs.unlink(path);
});
});

it('load scoped plugins', () => {
const name = '@some-scope/hexo-plugin-test';
const path = join(hexo.plugin_dir, name, 'index.js');
