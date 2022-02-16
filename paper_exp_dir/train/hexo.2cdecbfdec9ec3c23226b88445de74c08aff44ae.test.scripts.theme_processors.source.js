'use strict';

const { join } = require('path');
const { mkdirs, rmdir, unlink, writeFile } = require('hexo-fs');
const Promise = require('bluebird');

describe('source', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(join(__dirname, 'source_test'), {silent: true});
const processor = require('../../../lib/theme/processors/source');
const process = Promise.method(processor.process.bind(hexo));
const themeDir = join(hexo.base_dir, 'themes', 'test');
const Asset = hexo.model('Asset');

function newFile(options) {
const { path } = options;

options.params = {path};
options.path = 'source/' + path;
options.source = join(themeDir, options.path);

return new hexo.theme.File(options);
}

before(async () => {
await Promise.all([
mkdirs(themeDir),
writeFile(hexo.config_path, 'theme: test')
]);
await hexo.init();
});

after(() => rmdir(hexo.base_dir));

it('pattern', () => {
const { pattern } = processor;

pattern.match('source/foo.jpg').should.eql({path: 'foo.jpg'});
pattern.match('source/_foo.jpg').should.be.false;
pattern.match('source/foo/_bar.jpg').should.be.false;
pattern.match('source/foo.jpg~').should.be.false;
pattern.match('source/foo.jpg%').should.be.false;
pattern.match('layout/foo.swig').should.be.false;
pattern.match('layout/foo.njk').should.be.false;
pattern.match('package.json').should.be.false;
pattern.match('node_modules/test/test.js').should.be.false;
pattern.match('source/node_modules/test/test.js').should.be.false;
});

it('type: create', async () => {
const file = newFile({
path: 'style.css',
type: 'create'
