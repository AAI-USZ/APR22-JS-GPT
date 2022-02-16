var should = require('chai').should();
var pathFn = require('path');

describe('Asset', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var Asset = hexo.model('Asset');

it('default values', function(){
return Asset.insert({
_id: 'foo',
