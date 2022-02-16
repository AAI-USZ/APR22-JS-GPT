'use strict';

var should = require('chai').should();

describe('is', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var is = require('../../../lib/plugins/helper/is');

it('is_current', function(){
is.current.call({path: 'foo/bar', config: hexo.config}, 'foo').should.be.true;
