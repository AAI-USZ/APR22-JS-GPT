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
var asset = require('../../../lib/plugins/processor/asset');
var process = asset.process.bind(hexo);
var source = hexo.source;
var File = source.File;
var Asset = hexo.model('Asset');
var Page = hexo.model('Page');

function newFile(options) {
options.source = pathFn.join(source.base, options.path);
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

it('asset - type: create', function() {
var file = newFile({
path: 'foo.jpg',
type: 'create'
});

return fs.writeFile(file.source, 'foo').then(function() {
return process(file);
}).then(function() {
var id = 'source/' + file.path;
var asset = Asset.findById(id);

asset._id.should.eql(id);
asset.path.should.eql(file.path);
asset.modified.should.be.true;

