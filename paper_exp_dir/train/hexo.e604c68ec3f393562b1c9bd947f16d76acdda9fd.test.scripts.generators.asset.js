var should = require('chai').should();
var Promise = require('bluebird');
var pathFn = require('path');
var fs = require('hexo-fs');
var testUtil = require('../../util');

describe('asset', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(pathFn.join(__dirname, 'asset_test'), {silent: true});
var generator = require('../../../lib/plugins/generator/asset').bind(hexo);
var Asset = hexo.model('Asset');

function checkStream(stream, expected){
return testUtil.stream.read(stream).then(function(data){
data.should.eql(expected);
});
}

before(function(){
return fs.mkdirs(hexo.base_dir).then(function(){
return hexo.init();
});
});

after(function(){
return fs.rmdir(hexo.base_dir);
});

it('renderable', function(){
