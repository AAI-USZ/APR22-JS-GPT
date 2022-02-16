var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');
var sinon = require('sinon');

describe('generate', () => {
var Hexo = require('../../../lib/hexo');
var generateConsole = require('../../../lib/plugins/console/generate');
var hexo;
var generate;

beforeEach(() => {
hexo = new Hexo(pathFn.join(__dirname, 'generate_test'), {silent: true});
generate = generateConsole.bind(hexo);

return fs.mkdirs(hexo.base_dir).then(() => hexo.init());
});

afterEach(() => fs.rmdir(hexo.base_dir));

function testGenerate(options) {

return Promise.all([

fs.writeFile(pathFn.join(hexo.source_dir, 'test.txt'), 'test'),
fs.writeFile(pathFn.join(hexo.source_dir, 'faz', 'yo.txt'), 'yoooo'),

fs.writeFile(pathFn.join(hexo.public_dir, 'foo.txt'), 'foo'),
fs.writeFile(pathFn.join(hexo.public_dir, 'bar', 'boo.txt'), 'boo'),
fs.writeFile(pathFn.join(hexo.public_dir, 'faz', 'yo.txt'), 'yo')
]).then(() => generate(options)).then(() => Promise.all([
