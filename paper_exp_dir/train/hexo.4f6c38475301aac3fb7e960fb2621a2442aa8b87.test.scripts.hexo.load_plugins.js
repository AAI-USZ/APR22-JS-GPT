var should = require('chai').should();
var fs = require('hexo-fs');
var pathFn = require('path');
var Promise = require('bluebird');

describe('Load plugins', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'plugin_test'), {silent: true});
var loadPlugins = require('../../../lib/hexo/load_plugins');

var script = [
'hexo._script_test = {',
'  filename: __filename,',
'  dirname: __dirname,',
'  module: module,',
'  require: require',
'}'
].join('\n');

function validate(path) {
var result = hexo._script_test;

result.filename.should.eql(path);
result.dirname.should.eql(pathFn.dirname(path));
result.module.id.should.eql(path);
result.module.filename.should.eql(path);

delete hexo._script_test;
}

function createPackageFile(...args) {
var pkg = {
name: 'hexo-site',
version: '0.0.0',
private: true,
dependencies: {}
};

for (var i = 0, len = args.length; i < len; i++) {
pkg.dependencies[args[i]] = '*';
}

return fs.writeFile(pathFn.join(hexo.base_dir, 'package.json'), JSON.stringify(pkg, null, '  '));
}

function createPackageFileWithDevDeps(...args) {
var pkg = {
name: 'hexo-site',
version: '0.0.0',
private: true,
devDependencies: {}
};

for (var i = 0, len = args.length; i < len; i++) {
pkg.devDependencies[args[i]] = '*';
