var Hexo = require('../../../lib/hexo');
var fs = require('hexo-fs');
var pathFn = require('path');
var fixtureDir = pathFn.join(__dirname, '../../fixtures');

describe('Render', function(){
var hexo = new Hexo(__dirname);

before(function(){
return hexo.init();
});
