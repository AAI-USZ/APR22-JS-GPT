const should = require('chai').should();
const fs = require('hexo-fs');
const pathFn = require('path');
const Promise = require('bluebird');

describe('Load plugins', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'plugin_test'), {silent: true});
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
result.dirname.should.eql(pathFn.dirname(path));
result.module.id.should.eql(path);
result.module.filename.should.eql(path);

delete hexo._script_test;
}

function createPackageFile(...args) {
const pkg = {
