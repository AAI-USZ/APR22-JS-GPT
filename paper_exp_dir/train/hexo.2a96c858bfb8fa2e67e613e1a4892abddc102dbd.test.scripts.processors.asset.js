'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

describe('asset', () => {
const Hexo = require('../../../lib/hexo');
const baseDir = pathFn.join(__dirname, 'asset_test');
const hexo = new Hexo(baseDir);
const asset = require('../../../lib/plugins/processor/asset')(hexo);
const process = asset.process.bind(hexo);
const pattern = asset.pattern;
const source = hexo.source;
const File = source.File;
const Asset = hexo.model('Asset');
const Page = hexo.model('Page');

function newFile(options) {
options.source = pathFn.join(source.base, options.path);
options.params = {
renderable: options.renderable
};

return new File(options);
}

before(() => fs.mkdirs(baseDir).then(() => hexo.init()));

after(() => fs.rmdir(baseDir));

it('pattern', () => {

pattern.match('foo.json').should.have.property('renderable', true);


pattern.match('foo.txt').should.have.property('renderable', false);


should.not.exist(pattern.match('foo.txt~'));
should.not.exist(pattern.match('foo.txt%'));


should.not.exist(pattern.match('_foo.txt'));
should.not.exist(pattern.match('test/_foo.txt'));
should.not.exist(pattern.match('.foo.txt'));
should.not.exist(pattern.match('test/.foo.txt'));


hexo.config.include = ['fff/**'];
pattern.match('fff/_foo.txt').should.exist;
hexo.config.include = [];


hexo.config.exclude = ['fff/**'];
should.not.exist(pattern.match('fff/foo.txt'));
hexo.config.exclude = [];


hexo.config.skip_render = ['fff/**'];
pattern.match('fff/foo.json').should.have.property('renderable', false);
hexo.config.skip_render = [];
});

it('asset - type: create', () => {
const file = newFile({
path: 'foo.jpg',
type: 'create',
renderable: false
});

return fs.writeFile(file.source, 'foo').then(() => process(file)).then(() => {
const id = 'source/' + file.path;
const asset = Asset.findById(id);

asset._id.should.eql(id);
asset.path.should.eql(file.path);
asset.modified.should.be.true;
asset.renderable.should.be.false;

return asset.remove();
}).finally(() => fs.unlink(file.source));
});
it('asset - type: create (when source path is configed to parent directory)', () => {
const file = newFile({
path: '../../source/foo.jpg',
type: 'create',
renderable: false
});

return fs.writeFile(file.source, 'foo').then(() => process(file)).then(() => {
const id = '../source/foo.jpg';
const asset = Asset.findById(id);
