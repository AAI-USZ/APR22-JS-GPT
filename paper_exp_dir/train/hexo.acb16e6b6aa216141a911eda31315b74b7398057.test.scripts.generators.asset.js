const should = require('chai').should();
const Promise = require('bluebird');
const pathFn = require('path');
const fs = require('hexo-fs');
const testUtil = require('../../util');

describe('asset', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(pathFn.join(__dirname, 'asset_test'), {silent: true});
const generator = require('../../../lib/plugins/generator/asset').bind(hexo);
const Asset = hexo.model('Asset');

function checkStream(stream, expected) {
return testUtil.stream.read(stream).then(data => {
data.should.eql(expected);
});
}

before(() => fs.mkdirs(hexo.base_dir).then(() => hexo.init()));

after(() => fs.rmdir(hexo.base_dir));

it('renderable', () => {
const path = 'test.yml';
