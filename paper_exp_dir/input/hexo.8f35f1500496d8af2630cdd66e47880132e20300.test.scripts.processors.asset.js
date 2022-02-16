'use strict';

var should = require('chai').should();
var pathFn = require('path');
var fs = require('hexo-fs');
var Promise = require('bluebird');

var dateFormat = 'YYYY-MM-DD HH:mm:ss';

describe('asset', function() {
var Hexo = require('../../../lib/hexo');
var baseDir = pathFn.join(__dirname, 'asset_test');
var hexo = new Hexo(baseDir);
var asset = require('../../../lib/plugins/processor/asset')(hexo);
var process = asset.process.bind(hexo);
var pattern = asset.pattern;
var source = hexo.source;
var File = source.File;
var Asset = hexo.model('Asset');
var Page = hexo.model('Page');

function newFile(options) {
options.source = pathFn.join(source.base, options.path);
options.params = {
renderable: options.renderable
};

return new File(options);
}

before(function() {
return fs.mkdirs(baseDir).then(function() {
return hexo.init();
});
});

after(function() {
return fs.rmdir(baseDir);
});

it('pattern', function() {

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

it('asset - type: create', function() {
var file = newFile({
path: 'foo.jpg',
type: 'create',
renderable: false
});

return fs.writeFile(file.source, 'foo').then(function() {
return process(file);
}).then(function() {
var id = 'source/' + file.path;
var asset = Asset.findById(id);

asset._id.should.eql(id);
asset.path.should.eql(file.path);
asset.modified.should.be.true;
asset.renderable.should.be.false;

return asset.remove();
}).finally(function() {
return fs.unlink(file.source);
});
});

it('asset - type: update', function() {
var file = newFile({
path: 'foo.jpg',
type: 'update',
renderable: false
});

var id = 'source/' + file.path;

return Promise.all([
fs.writeFile(file.source, 'test'),
Asset.insert({
_id: id,
path: file.path,
modified: false
})
]).then(function() {
return process(file);
}).then(function() {
var asset = Asset.findById(id);

asset._id.should.eql(id);
asset.path.should.eql(file.path);
asset.modified.should.be.true;
asset.renderable.should.be.false;

return asset.remove();
}).finally(function() {
return fs.unlink(file.source);
});
});

var file = newFile({
path: 'foo.jpg',
renderable: false
});

