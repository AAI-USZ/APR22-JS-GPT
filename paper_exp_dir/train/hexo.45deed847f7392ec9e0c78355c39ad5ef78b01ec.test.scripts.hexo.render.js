var Hexo = require('../../../lib/hexo');
var util = Hexo.util;
var fs = util.fs;
var pathFn = require('path');
var fixtureDir = pathFn.join(__dirname, '../../fixtures');

describe('Render', function(){
var hexo = new Hexo(__dirname);

before(function(){
return hexo.init();
});

it('isRenderable()', function(){
hexo.render.isRenderable('test.txt').should.be.false;


hexo.render.isRenderable('test.htm').should.be.true;
hexo.render.isRenderable('test.html').should.be.true;

