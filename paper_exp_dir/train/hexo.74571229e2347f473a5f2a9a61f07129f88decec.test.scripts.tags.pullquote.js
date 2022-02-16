'use strict';

var should = require('chai').should();

describe('pullquote', function(){
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo(__dirname);
var pullquote = require('../../../lib/plugins/tag/pullquote')(hexo);

before(function(){
return hexo.init().then(function(){
